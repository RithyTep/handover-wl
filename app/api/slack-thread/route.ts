import { NextRequest, NextResponse } from "next/server";

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;

export async function POST(request: NextRequest) {
  try {
    if (!SLACK_BOT_TOKEN || !SLACK_CHANNEL) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing SLACK_BOT_TOKEN or SLACK_CHANNEL in .env.local",
          setup: {
            step1: "Go to https://api.slack.com/apps and create an app",
            step2: "Add Bot Token Scopes: chat:write, channels:history",
            step3: "Install app to workspace",
            step4: "Copy Bot User OAuth Token (starts with xoxb-)",
            step5: "Get channel ID (right-click channel > View channel details)",
          }
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { message, thread_ts } = body;

    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SLACK_BOT_TOKEN}`,
      },
      body: JSON.stringify({
        channel: SLACK_CHANNEL,
        text: message,
        ...(thread_ts && { thread_ts }),
        unfurl_links: false,
        unfurl_media: false,
      }),
    });

    const result = await response.json();

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      ts: result.ts,
      channel: result.channel,
      message: "Message posted successfully"
    });
  } catch (error: unknown) {
    console.error("Error posting to Slack:", error);
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!SLACK_BOT_TOKEN || !SLACK_CHANNEL) {
      return NextResponse.json(
        { success: false, error: "Missing SLACK_BOT_TOKEN or SLACK_CHANNEL" },
        { status: 400 }
      );
    }

    const authTest = await fetch("https://slack.com/api/auth.test", {
      headers: {
        "Authorization": `Bearer ${SLACK_BOT_TOKEN}`,
      },
    });
    const authResult = await authTest.json();

    if (!authResult.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Token invalid: ${authResult.error}`,
          debug: {
            tokenPrefix: SLACK_BOT_TOKEN?.substring(0, 10) + "...",
            channel: SLACK_CHANNEL
          }
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://slack.com/api/conversations.history?channel=${SLACK_CHANNEL}&limit=10`,
      {
        headers: {
          "Authorization": `Bearer ${SLACK_BOT_TOKEN}`,
        },
      }
    );

    const result = await response.json();

    if (!result.ok) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          debug: {
            botUser: authResult.user,
            botId: authResult.user_id,
            team: authResult.team,
            channel: SLACK_CHANNEL,
            hint: result.error === "channel_not_found"
              ? "Bot needs to be invited to channel: /invite @" + authResult.user
              : null
          }
        },
        { status: 400 }
      );
    }

    const messages = result.messages.map((msg: { ts: string; text?: string; user?: string }) => ({
      ts: msg.ts,
      text: msg.text?.substring(0, 100) + (msg.text && msg.text.length > 100 ? "..." : ""),
      user: msg.user,
    }));

    return NextResponse.json({ success: true, messages });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
