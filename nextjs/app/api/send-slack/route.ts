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

    // Check for Bot Token (required for thread replies)
    if (!SLACK_BOT_TOKEN || !SLACK_CHANNEL) {
      return NextResponse.json(
        { success: false, error: "Missing SLACK_BOT_TOKEN or SLACK_CHANNEL" },
        { status: 400 }
      );
    }

    // Find the latest message from "Support WL - Rithy"
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
      return NextResponse.json(
        { success: false, error: `Failed to fetch messages: ${historyResult.error}` },
        { status: 400 }
      );
    }

    // Find a message containing "Ticket Handover Information"
    let targetTs = null;

    for (const msg of historyResult.messages) {
      // Look for message with "Ticket Handover Information" text
      if (msg.text && msg.text.includes("Ticket Handover Information")) {
        targetTs = msg.ts;
        break;
      }
    }

    // If no handover message found, don't send anything
    if (!targetTs) {
      return NextResponse.json({
        success: true,
        message: "No handover message found to reply to - skipped sending"
      });
    }

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

    // Build message with @support wl mention
    let message = "Ticket Handover Information\n\n";

    filledTickets.forEach((ticketKey, index) => {
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
        thread_ts: targetTs, // Reply to the latest user message
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
      thread_ts: targetTs,
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
