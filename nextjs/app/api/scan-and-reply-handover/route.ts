import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { loadTicketData, updateLastPostedAt, getEnabledScheduledComments, getCustomChannelId, getMemberMentions } from "@/lib/db";

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_USER_TOKEN = process.env.SLACK_USER_TOKEN;
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
    console.log("[Scan and Reply] Starting scan for handover messages...");

    // Get custom channel ID or use default
    const customChannelId = await getCustomChannelId();
    const channelToUse = customChannelId || SLACK_CHANNEL;

    console.log(`[Scan and Reply] Using channel: ${channelToUse}${customChannelId ? ' (custom)' : ' (default)'}`);

    // Check if there are any enabled scheduled comments
    const scheduledComments = await getEnabledScheduledComments();
    const slackComments = scheduledComments.filter(c => c.comment_type === 'slack');

    if (slackComments.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No scheduled comments configured",
        replied: false,
      });
    }

    // Step 1: Fetch recent messages from Slack channel
    const historyResponse = await fetch(
      `https://slack.com/api/conversations.history?channel=${channelToUse}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${SLACK_USER_TOKEN}`,
        },
      }
    );

    const historyData = await historyResponse.json();

    if (!historyData.ok) {
      throw new Error(`Failed to fetch messages: ${historyData.error}`);
    }

    // Step 2: Find the latest handover message (search for "ticket information")
    const handoverMessage = historyData.messages.find((msg: any) =>
      msg.text && (
        msg.text.includes("*Ticket Handover Information*")
      )
    );
    console.log("🚀 ~ POST ~ handoverMessage:", handoverMessage)

    if (!handoverMessage) {
      console.log("[Scan and Reply] No handover message found with 'Ticket Handover Information'");
      return NextResponse.json({
        success: true,
        message: "No handover message found",
        replied: false,
      });
    }

    console.log("[Scan and Reply] Found handover message:", handoverMessage.ts);

    // Step 3: Check if it already has replies
    const repliesResponse = await fetch(
      `https://slack.com/api/conversations.replies?channel=${channelToUse}&ts=${handoverMessage.ts}`,
      {
        headers: {
          Authorization: `Bearer ${SLACK_USER_TOKEN}`,
        },
      }
    );

    const repliesData = await repliesResponse.json();

    if (!repliesData.ok) {
      throw new Error(`Failed to fetch replies: ${repliesData.error}`);
    }

    // Check if there are any replies (excluding the parent message)
    const hasReplies = repliesData.messages && repliesData.messages.length > 1;

    if (hasReplies) {
      console.log("[Scan and Reply] Message already has replies, skipping");
      return NextResponse.json({
        success: true,
        message: "Handover message already has replies",
        replied: false,
      });
    }

    // Step 4: Fetch current ticket data
    console.log("[Scan and Reply] Fetching ticket data...");

    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");

    const jiraResponse = await axios.post(
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

    const savedData = await loadTicketData();

    interface TicketInfo {
      key: string;
      summary: string;
      wlMainTicketType: string;
      wlSubTicketType: string;
      savedStatus: string;
      savedAction: string;
    }

    const tickets: TicketInfo[] = jiraResponse.data.issues.map((issue: any) => {
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

    // Build the reply message
    let replyMessage = `Please refer to this ticket information\n`;

    // Add member mentions if configured
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

    // Step 5: Post reply using USER TOKEN
    console.log("[Scan and Reply] Posting reply to handover message...");

    const postResponse = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SLACK_USER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: channelToUse,
        text: replyMessage.trim(),
        thread_ts: handoverMessage.ts, // Post as a thread reply
        unfurl_links: false,
        unfurl_media: false,
      }),
    });

    const postData = await postResponse.json();

    if (!postData.ok) {
      throw new Error(`Failed to post reply: ${postData.error}`);
    }

    console.log("[Scan and Reply] Successfully posted reply");

    // Update last_posted_at for all scheduled comments
    for (const comment of slackComments) {
      await updateLastPostedAt(comment.id);
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
    console.error("[Scan and Reply] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
