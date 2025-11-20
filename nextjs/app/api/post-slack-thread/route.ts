import { NextRequest, NextResponse } from "next/server";
import { updateLastPostedAt } from "@/lib/db";

// POST - Post a threaded comment to Slack using user token
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { comment_text, thread_ts, scheduled_comment_id } = body;

    console.log(`[API] post-slack-thread called with:`, { comment_text, thread_ts, scheduled_comment_id });

    if (!comment_text) {
      return NextResponse.json(
        { success: false, error: "Missing required field: comment_text" },
        { status: 400 }
      );
    }

    // Get Slack configuration from environment variables
    const slackUserToken = process.env.SLACK_USER_TOKEN;
    const slackChannel = process.env.SLACK_CHANNEL;

    if (!slackUserToken || !slackChannel) {
      console.error("Missing Slack configuration");
      return NextResponse.json(
        { success: false, error: "Missing Slack configuration (SLACK_USER_TOKEN or SLACK_CHANNEL)" },
        { status: 500 }
      );
    }

    const slackPayload = {
      channel: slackChannel,
      text: comment_text,
      thread_ts: thread_ts, // If provided, posts as a thread reply
    };

    console.log(`[API] Sending to Slack with payload:`, slackPayload);

    // Post comment to Slack thread using user token
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${slackUserToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slackPayload),
    });

    const data = await response.json();

    console.log(`[API] Slack API response:`, data);

    if (!data.ok) {
      console.error(`[API] Failed to post Slack comment. Error:`, data.error);
      console.error(`[API] Full Slack response:`, JSON.stringify(data, null, 2));
      return NextResponse.json(
        { success: false, error: `Failed to post to Slack: ${data.error}` },
        { status: 400 }
      );
    }

    console.log(`[API] Successfully posted Slack thread comment. Message ts:`, data.ts, `Thread ts:`, data.thread_ts);

    // Update last_posted_at if this is from a scheduled comment
    if (scheduled_comment_id) {
      await updateLastPostedAt(scheduled_comment_id);
    }

    return NextResponse.json({
      success: true,
      message: "Comment posted to Slack",
      ts: data.ts,
    });
  } catch (error) {
    console.error("Error posting comment to Slack:", error);
    return NextResponse.json(
      { success: false, error: "Failed to post comment to Slack" },
      { status: 500 }
    );
  }
}
