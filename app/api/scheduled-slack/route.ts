import { NextRequest, NextResponse } from "next/server";
import {
  loadTicketData,
  getCustomChannelId,
  getEveningUserToken,
  getNightUserToken,
  getEveningMentions,
  getNightMentions,
  getTicketsWithSavedData,
} from "@/lib/services";

const SLACK_CHANNEL = process.env.SLACK_CHANNEL;
const JIRA_URL = process.env.JIRA_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const shift = body.shift as "evening" | "night" | undefined;

    if (!shift) {
      throw new Error("Shift parameter (evening or night) is required");
    }

    const userToken =
      shift === "evening" ? await getEveningUserToken() : await getNightUserToken();

    const mentions =
      shift === "evening" ? await getEveningMentions() : await getNightMentions();

    if (!userToken) {
      throw new Error(`No user token configured for ${shift} shift`);
    }

    const customChannelId = await getCustomChannelId();
    const channelToUse = customChannelId || SLACK_CHANNEL;

    const savedData = await loadTicketData();
    const tickets = await getTicketsWithSavedData(savedData);

    if (!userToken || !channelToUse) {
      throw new Error("Missing user token or channel");
    }

    const shiftLabel = shift.charAt(0).toUpperCase() + shift.slice(1);
    let message = `*${shiftLabel} Shift Handover - ${new Date().toLocaleString("en-US", {
      timeZone: "Asia/Bangkok",
      dateStyle: "full",
      timeStyle: "short",
    })}*\n\nPlease refer to this ticket information\n`;

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

    const postResponse = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
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

    return NextResponse.json({
      success: true,
      shift,
      ticketsProcessed: tickets.length,
      message_ts: postResult.ts,
      ticketMessage: message.trim(),
      sentAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
