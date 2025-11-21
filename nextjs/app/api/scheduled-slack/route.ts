import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import {
  loadTicketData,
  getCustomChannelId,
  getEveningUserToken,
  getNightUserToken,
  getEveningMentions,
  getNightMentions
} from "@/lib/db";

const SLACK_CHANNEL = process.env.SLACK_CHANNEL;
const JIRA_URL = process.env.JIRA_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

const JQL_QUERY = `
project = TCP
AND issuetype in standardIssueTypes()
AND status in ("WL - Pending", "WL - Processing")
AND "Release Date[Date]" = EMPTY
ORDER BY created ASC, updated DESC
`;

export async function POST(request: NextRequest) {
  try {
    // Parse request body to get shift information
    const body = await request.json();
    const shift = body.shift as "evening" | "night" | undefined;

    if (!shift) {
      throw new Error("Shift parameter (evening or night) is required");
    }

    console.log(`[Scheduled Task] Processing ${shift} shift handover...`);

    // Get shift-specific user token and mentions
    const userToken = shift === "evening"
      ? await getEveningUserToken()
      : await getNightUserToken();

    const mentions = shift === "evening"
      ? await getEveningMentions()
      : await getNightMentions();

    if (!userToken) {
      throw new Error(`No user token configured for ${shift} shift`);
    }

    console.log(`[Scheduled Task] Using ${shift} shift user token`);

    // Get custom channel ID or use default
    const customChannelId = await getCustomChannelId();
    const channelToUse = customChannelId || SLACK_CHANNEL;

    console.log(`[Scheduled Task] Using channel: ${channelToUse}${customChannelId ? ' (custom)' : ' (default)'}`);

    console.log("[Scheduled Task] Fetching tickets from Jira...");

    // Fetch tickets from Jira
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");

    const response = await axios.post(
      `${JIRA_URL}/rest/api/3/search/jql`,
      {
        jql: JQL_QUERY.trim(),
        maxResults: 100,
        fields: [
          "key",
          "summary",
          "status",
          "assignee",
          "created",
          "duedate",
          "issuetype",
          "customfield_10451", // WL Main Ticket Type
          "customfield_10453", // WL Sub Ticket Type
          "customfield_10400", // Customer Level
        ],
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    // Load saved data from database
    const savedData = await loadTicketData();

    interface TicketInfo {
      key: string;
      summary: string;
      wlMainTicketType: string;
      wlSubTicketType: string;
      savedStatus: string;
      savedAction: string;
    }

    const tickets: TicketInfo[] = response.data.issues.map((issue: any) => {
      const ticketKey = issue.key;
      const ticketData = savedData[ticketKey];
      return {
        key: ticketKey,
        summary: issue.fields.summary,
        wlMainTicketType: issue.fields.customfield_10451?.value || "None",
        wlSubTicketType: issue.fields.customfield_10453?.value || "None",
        savedStatus: ticketData?.status || "--",
        savedAction: ticketData?.action || "--",
      };
    });

    console.log(`[Scheduled Task] Found ${tickets.length} tickets`);

    // Check for required fields
    if (!userToken || !channelToUse) {
      throw new Error("Missing user token or channel");
    }

    // Build Slack message with scheduler timestamp and shift info
    const shiftLabel = shift.charAt(0).toUpperCase() + shift.slice(1);
    let message = `*${shiftLabel} Shift Handover - ${new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok", dateStyle: "full", timeStyle: "short" })}*\n\nPlease refer to this ticket information\n`;

    // Add shift-specific member mentions if configured
    if (mentions) {
      message += `${mentions}\n`;
    }

    message += `\n`;

    if (tickets.length === 0) {
      message += "_No tickets to report._\n";
    } else {
      tickets.forEach((ticket, index) => {
        const ticketUrl = `${JIRA_URL}/browse/${ticket.key}`;

        message += `--- Ticket ${index + 1} ---\n`;
        message += `Ticket Link: <${ticketUrl}|${ticket.key}> ${ticket.summary}\n`;
        message += `WL Main Type: ${ticket.wlMainTicketType}\n`;
        message += `WL Sub Type: ${ticket.wlSubTicketType}\n`;
        message += `Status: ${ticket.savedStatus}\n`;
        message += `Action: ${ticket.savedAction}\n`;
        message += `\n`;
      });
    }
    message += `===========================\n`;

    // Post message to channel using shift-specific user token
    const postResponse = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        channel: channelToUse,
        text: message.trim(),
        unfurl_links: false,
        unfurl_media: false,
      }),
    });

    const postResult = await postResponse.json();

    if (!postResult.ok) {
      throw new Error(`Failed to post message: ${postResult.error}`);
    }

    console.log(`[Scheduled Task] Successfully sent ${shift} shift handover to Slack`);

    return NextResponse.json({
      success: true,
      shift,
      ticketsProcessed: tickets.length,
      message_ts: postResult.ts,
      ticketMessage: message.trim(), // Return the formatted ticket message for thread comments
      sentAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Scheduled Task] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
