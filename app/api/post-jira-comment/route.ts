import { NextRequest, NextResponse } from "next/server";
import { updateCommentLastPosted, postComment } from "@/lib/services";
import { rateLimit, getClientIP, getRateLimitHeaders } from "@/lib/security/rate-limit";

const JIRA_RATE_LIMIT = 20;
const JIRA_RATE_WINDOW_MS = 60000;

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);
  const rateLimitResult = rateLimit(ip, JIRA_RATE_LIMIT, JIRA_RATE_WINDOW_MS);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { success: false, error: "Rate limit exceeded. Please try again later." },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult, JIRA_RATE_LIMIT),
      }
    );
  }

  try {
    const body = await req.json();
    const { ticket_key, comment_text, scheduled_comment_id } = body;

    if (!ticket_key || !comment_text) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: ticket_key, comment_text" },
        { status: 400 }
      );
    }

    const success = await postComment(ticket_key, comment_text);

    if (!success) {
      return NextResponse.json(
        { success: false, error: `Failed to post comment to ${ticket_key}` },
        { status: 500 }
      );
    }

    if (scheduled_comment_id) {
      await updateCommentLastPosted(scheduled_comment_id);
    }

    return NextResponse.json({
      success: true,
      message: `Comment posted to ${ticket_key}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
