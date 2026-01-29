import { NextRequest, NextResponse } from "next/server";
import { initDatabase, setSetting } from "@/lib/services";

// Receives Jira webhook events and stores the latest event timestamp
// Configure in Jira: Admin → System → Webhooks → Add
// URL: https://your-app.vercel.app/api/webhook-jira
// Events: Issue Created, Issue Updated
// JQL filter: project = TCP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const event = body.webhookEvent ?? "unknown";
    const issueKey = body.issue?.key ?? null;
    const timestamp = Date.now().toString();

    await initDatabase();
    await setSetting("webhook_last_event", timestamp);

    if (issueKey) {
      await setSetting("webhook_last_issue", issueKey);
    }

    return NextResponse.json({
      success: true,
      event,
      issueKey,
      received: timestamp,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Webhook processing failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
