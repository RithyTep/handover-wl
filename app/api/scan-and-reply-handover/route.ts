import { NextRequest, NextResponse } from "next/server";
import {
  loadTicketData,
  updateCommentLastPosted,
  getEnabledScheduledComments,
  getCustomChannelId,
  getMemberMentions,
  getTicketsWithSavedData,
} from "@/lib/services";
import { JQL_QUERY, JIRA_FIELDS, JIRA } from "@/lib/config";

const SLACK_USER_TOKEN = process.env.SLACK_USER_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;
const JIRA_URL = process.env.JIRA_URL;

export async function POST(request: NextRequest) {
  try {
    const customChannelId = await getCustomChannelId();
    const channelToUse = customChannelId || SLACK_CHANNEL;

    const scheduledComments = await getEnabledScheduledComments();
    const slackComments = scheduledComments.filter((c) => c.comment_type === "slack");

    if (slackComments.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No scheduled comments configured",
        replied: false,
      });
    }

    const historyResponse = await fetch(
      `https://slack.com/api/conversations.history?channel=${channelToUse}&limit=10`,
      { headers: { Authorization: `Bearer ${SLACK_USER_TOKEN}` } }
    );

    const historyData = await historyResponse.json();

    if (!historyData.ok) {
      throw new Error(`Failed to fetch messages: ${historyData.error}`);
    }

    const handoverMessage = historyData.messages.find(
      (msg: any) => msg.text && msg.text.includes("*Ticket Handover Information*")
    );

    if (!handoverMessage) {
      return NextResponse.json({
        success: true,
        message: "No handover message found",
        replied: false,
      });
    }

    const repliesResponse = await fetch(
      `https://slack.com/api/conversations.replies?channel=${channelToUse}&ts=${handoverMessage.ts}`,
      { headers: { Authorization: `Bearer ${SLACK_USER_TOKEN}` } }
    );

    const repliesData = await repliesResponse.json();

    if (!repliesData.ok) {
      throw new Error(`Failed to fetch replies: ${repliesData.error}`);
    }

    const hasReplies = repliesData.messages && repliesData.messages.length > 1;

    if (hasReplies) {
      return NextResponse.json({
        success: true,
        message: "Handover message already has replies",
        replied: false,
      });
    }

    const savedData = await loadTicketData();
    const tickets = await getTicketsWithSavedData(savedData);

    let replyMessage = `Please refer to this ticket information\n`;

    const mentions = await getMemberMentions();
    if (mentions) {
      replyMessage += `${mentions}\n`;
    }

    replyMessage += `\n`;

    if (tickets.length === 0) {
      replyMessage += "_No tickets to report._\n";
    } else {
      tickets.forEach((ticket, index) => {
        const ticketUrl = `${JIRA_URL}/browse/${ticket.key}`;
        replyMessage += `--- Ticket ${index + 1} ---\n`;
        replyMessage += `Ticket Link: <${ticketUrl}|${ticket.key}> ${ticket.summary}\n`;
        replyMessage += `WL Main Type: ${ticket.wlMainTicketType}\n`;
        replyMessage += `WL Sub Type: ${ticket.wlSubTicketType}\n`;
        replyMessage += `Status: ${ticket.savedStatus}\n`;
        replyMessage += `Action: ${ticket.savedAction}\n`;
        replyMessage += `\n`;
      });
    }

    const postResponse = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SLACK_USER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: channelToUse,
        text: replyMessage.trim(),
        thread_ts: handoverMessage.ts,
        unfurl_links: false,
        unfurl_media: false,
      }),
    });

    const postData = await postResponse.json();

    if (!postData.ok) {
      throw new Error(`Failed to post reply: ${postData.error}`);
    }

    for (const comment of slackComments) {
      await updateCommentLastPosted(comment.id);
    }

    return NextResponse.json({
      success: true,
      message: "Reply posted successfully",
      replied: true,
      handoverMessageTs: handoverMessage.ts,
      replyTs: postData.ts,
      ticketsCount: tickets.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
