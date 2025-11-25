import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;
const JIRA_URL = process.env.JIRA_URL;
const STORAGE_FILE = path.join(process.cwd(), "ticket_data.json");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketData, ticketDetails } = body;

    // Save the data first
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(ticketData, null, 2));

    // Check for Bot Token
    if (!SLACK_BOT_TOKEN || !SLACK_CHANNEL) {
      return NextResponse.json(
        { success: false, error: "Missing SLACK_BOT_TOKEN or SLACK_CHANNEL" },
        { status: 400 }
      );
    }

    // Build Slack message
    const ticketKeys = Object.keys(ticketData)
      .filter((key) => key.startsWith("status-"))
      .map((key) => key.replace("status-", ""));

    // Build message with all tickets (show -- for empty status/action)
    let message = "Please refer to this ticket information\n\n";

    ticketKeys.forEach((ticketKey, index) => {
      const status = ticketData[`status-${ticketKey}`] || "--";
      const action = ticketData[`action-${ticketKey}`] || "--";
      const details = ticketDetails?.[ticketKey] || {};
      const summary = details.summary || "";
      const wlMainType = details.wlMainTicketType || "--";
      const wlSubType = details.wlSubTicketType || "--";
      const ticketUrl = `${JIRA_URL}/browse/${ticketKey}`;

      message += `--- Ticket ${index + 1} ---\n`;
      message += `Ticket Link: <${ticketUrl}|${ticketKey}> ${summary}\n`;
      message += `WL Main Type: ${wlMainType}\n`;
      message += `WL Sub Type: ${wlSubType}\n`;
      message += `Status: ${status}\n`;
      message += `Action: ${action}\n`;
      message += `\n`;
    });
      message += `===========================\n`;
    // Post message to channel using Bot Token
    const postResponse = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SLACK_BOT_TOKEN}`,
      },
      body: JSON.stringify({
        channel: SLACK_CHANNEL,
        text: message.trim(),
        unfurl_links: false,
        unfurl_media: false,
      }),
    });

    const postResult = await postResponse.json();

    if (!postResult.ok) {
      return NextResponse.json(
        { success: false, error: postResult.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message_ts: postResult.ts
    });
  } catch (error: any) {
    console.error("Error sending to Slack:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
