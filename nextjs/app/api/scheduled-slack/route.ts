import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { loadTicketData } from "@/lib/db";

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
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

    // Filter tickets that have status or action filled
    const filledTickets = tickets.filter(
      (ticket) => ticket.savedStatus !== "--" || ticket.savedAction !== "--"
    );

    console.log(`[Scheduled Task] ${filledTickets.length} tickets with updates`);

    // Check for Bot Token
    if (!SLACK_BOT_TOKEN || !SLACK_CHANNEL) {
      throw new Error("Missing SLACK_BOT_TOKEN or SLACK_CHANNEL");
    }

    // Find message containing "Ticket Handover Information" to reply to
    const historyResponse = await fetch(
      `https://slack.com/api/conversations.history?channel=${SLACK_CHANNEL}&limit=50`,
      {
        headers: {
          "Authorization": `Bearer ${SLACK_BOT_TOKEN}`,
        },
      }
    );
    const historyResult = await historyResponse.json();

    if (!historyResult.ok) {
      throw new Error(`Failed to fetch messages: ${historyResult.error}`);
    }

    // Find a message containing "Ticket Handover Information"
    let targetTs = null;
    for (const msg of historyResult.messages) {
      if (msg.text && msg.text.includes("Ticket Handover Information")) {
        targetTs = msg.ts;
        break;
      }
    }

    // If no handover message found, skip sending
    if (!targetTs) {
      console.log("[Scheduled Task] No handover message found to reply to - skipped");
      return NextResponse.json({
        success: true,
        message: "No handover message found to reply to - skipped sending"
      });
    }

    // Build Slack message
    let message = "Ticket Handover Information\n\n";

    if (filledTickets.length === 0) {
      message += "_No ticket updates to report._\n";
    } else {
      filledTickets.forEach((ticket, index) => {
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

    // Post as thread reply using Bot Token
    const postResponse = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SLACK_BOT_TOKEN}`,
      },
      body: JSON.stringify({
        channel: SLACK_CHANNEL,
        text: message.trim(),
        thread_ts: targetTs,
        unfurl_links: false,
        unfurl_media: false,
      }),
    });

    const postResult = await postResponse.json();

    if (!postResult.ok) {
      throw new Error(`Failed to post message: ${postResult.error}`);
    }

    console.log("[Scheduled Task] Successfully sent to Slack as thread reply");

    return NextResponse.json({
      success: true,
      ticketsProcessed: tickets.length,
      ticketsWithUpdates: filledTickets.length,
      thread_ts: targetTs,
      message_ts: postResult.ts,
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
