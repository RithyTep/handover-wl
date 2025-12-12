import { NextRequest, NextResponse } from "next/server";
import {
  getScheduledComments,
  createScheduledComment,
  updateScheduledComment,
  deleteScheduledComment,
} from "@/lib/services";

export async function GET() {
  try {
    const comments = await getScheduledComments();
    return NextResponse.json({ success: true, comments });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { comment_type = "jira", ticket_key, comment_text, cron_schedule, enabled = true } = body;

    if (!comment_text || !cron_schedule) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: comment_text, cron_schedule" },
        { status: 400 }
      );
    }

    if (comment_type === "jira" && !ticket_key) {
      return NextResponse.json(
        { success: false, error: "ticket_key is required for Jira comments" },
        { status: 400 }
      );
    }

    const comment = await createScheduledComment({
      commentType: comment_type,
      commentText: comment_text,
      cronSchedule: cron_schedule,
      enabled,
      ticketKey: ticket_key,
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Failed to create scheduled comment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, comment });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, comment_type = "jira", ticket_key, comment_text, cron_schedule, enabled } = body;

    if (!id || !comment_text || !cron_schedule || enabled === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: id, comment_text, cron_schedule, enabled" },
        { status: 400 }
      );
    }

    if (comment_type === "jira" && !ticket_key) {
      return NextResponse.json(
        { success: false, error: "ticket_key is required for Jira comments" },
        { status: 400 }
      );
    }

    const comment = await updateScheduledComment({
      id,
      commentType: comment_type,
      commentText: comment_text,
      cronSchedule: cron_schedule,
      enabled,
      ticketKey: ticket_key,
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Failed to update scheduled comment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, comment });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    const success = await deleteScheduledComment(parseInt(id));

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to delete scheduled comment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
