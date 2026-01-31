import { NextRequest, NextResponse } from "next/server";
import { setDueDate } from "@/lib/services";

export async function POST(request: NextRequest) {
  try {
    const { ticket_key, due_date } = await request.json();

    if (!ticket_key || !due_date) {
      return NextResponse.json(
        { success: false, error: "ticket_key and due_date are required" },
        { status: 400 }
      );
    }

    const result = await setDueDate(ticket_key, due_date);

    return NextResponse.json({
      success: result,
      message: result ? "Due date updated" : "Failed to update due date",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to set due date";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
