import { NextRequest, NextResponse } from "next/server";
import {
  getScheduledComments,
  createScheduledComment,
  updateScheduledComment,
  deleteScheduledComment,
} from "@/lib/db";

// GET - Fetch all scheduled comments
export async function GET() {
  try {
    const comments = await getScheduledComments();
    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error("Error fetching scheduled comments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch scheduled comments" },
      { status: 500 }
    );
  }
}

// POST - Create a new scheduled comment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { comment_type = 'jira', ticket_key, comment_text, cron_schedule, enabled = true } = body;

    if (!comment_text || !cron_schedule) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: comment_text, cron_schedule" },
        { status: 400 }
      );
    }

    // For Jira comments, ticket_key is required
    if (comment_type === 'jira' && !ticket_key) {
      return NextResponse.json(
        { success: false, error: "ticket_key is required for Jira comments" },
        { status: 400 }
      );
    }

    const comment = await createScheduledComment(
      comment_type,
      comment_text,
      cron_schedule,
      enabled,
      ticket_key
    );

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Failed to create scheduled comment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error("Error creating scheduled comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create scheduled comment" },
      { status: 500 }
    );
  }
}

// PUT - Update an existing scheduled comment
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, comment_type = 'jira', ticket_key, comment_text, cron_schedule, enabled } = body;

    if (!id || !comment_text || !cron_schedule || enabled === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: id, comment_text, cron_schedule, enabled" },
        { status: 400 }
      );
    }

    // For Jira comments, ticket_key is required
    if (comment_type === 'jira' && !ticket_key) {
      return NextResponse.json(
        { success: false, error: "ticket_key is required for Jira comments" },
        { status: 400 }
      );
    }

    const comment = await updateScheduledComment(
      id,
      comment_type,
      comment_text,
      cron_schedule,
      enabled,
      ticket_key
    );

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Failed to update scheduled comment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error("Error updating scheduled comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update scheduled comment" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a scheduled comment
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
  } catch (error) {
    console.error("Error deleting scheduled comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete scheduled comment" },
      { status: 500 }
    );
  }
}
