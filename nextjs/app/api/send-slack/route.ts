import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import fs from "fs";
import path from "path";

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const JIRA_URL = process.env.JIRA_URL;
const STORAGE_FILE = path.join(process.cwd(), "ticket_data.json");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketData, ticketSummaries } = body;

    // Save the data first
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(ticketData, null, 2));

    // Build Slack message
    const ticketKeys = Object.keys(ticketData)
      .filter((key) => key.startsWith("status-"))
      .map((key) => key.replace("status-", ""));

    // Filter tickets that have status or action filled
    const filledTickets = ticketKeys.filter((ticketKey) => {
      const status = ticketData[`status-${ticketKey}`];
      const action = ticketData[`action-${ticketKey}`];
      return status !== "--" || action !== "--";
    });

    let message = "";

    filledTickets.forEach((ticketKey, index) => {
      const status = ticketData[`status-${ticketKey}`] || "--";
      const action = ticketData[`action-${ticketKey}`] || "--";
      const summary = ticketSummaries?.[ticketKey] || "";
      const ticketUrl = `${JIRA_URL}/browse/${ticketKey}`;

      message += `--- Ticket ${index + 1} ---\n`;
      message += `Ticket Link: <${ticketUrl}|${ticketKey}> ${summary}\n`;
      message += `Status: ${status}\n`;
      message += `Action: ${action}\n`;
      message += `\n`;
    });

    // Post to Slack
    await axios.post(SLACK_WEBHOOK_URL!, {
      text: message.trim(),
      unfurl_links: false,
      unfurl_media: false,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error sending to Slack:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
