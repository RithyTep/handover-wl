import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { loadTicketData } from "@/lib/db";

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
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

    // Build Slack message
    let message = `*Sent by Scheduler - ${new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok", dateStyle: "full", timeStyle: "short" })}*\n\n`;

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

    // Post to Slack
    if (!SLACK_WEBHOOK_URL) {
      throw new Error("SLACK_WEBHOOK_URL is not configured");
    }

    await axios.post(SLACK_WEBHOOK_URL, {
      text: message.trim(),
      unfurl_links: false,
      unfurl_media: false,
    });

    console.log("[Scheduled Task] Successfully sent to Slack");

    return NextResponse.json({
      success: true,
      ticketsProcessed: tickets.length,
      ticketsWithUpdates: filledTickets.length,
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
