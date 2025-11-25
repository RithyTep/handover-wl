import { NextRequest, NextResponse } from "next/server";
import { updateCommentLastPosted } from "@/lib/services";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { comment_text, thread_ts, scheduled_comment_id } = body;

    if (!comment_text) {
      return NextResponse.json(
        { success: false, error: "Missing required field: comment_text" },
        { status: 400 }
      );
    }

    const slackUserToken = process.env.SLACK_USER_TOKEN;
    const slackChannel = process.env.SLACK_CHANNEL;

    if (!slackUserToken || !slackChannel) {
      return NextResponse.json(
        { success: false, error: "Missing Slack configuration (SLACK_USER_TOKEN or SLACK_CHANNEL)" },
        { status: 500 }
      );
    }

    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${slackUserToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: slackChannel,
        text: comment_text,
        thread_ts: thread_ts,
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      return NextResponse.json(
        { success: false, error: `Failed to post to Slack: ${data.error}` },
        { status: 400 }
      );
    }

    if (scheduled_comment_id) {
      await updateCommentLastPosted(scheduled_comment_id);
    }

    return NextResponse.json({
      success: true,
      message: "Comment posted to Slack",
      ts: data.ts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
