import { NextResponse } from "next/server";
import { fetchTicketPoll } from "@/lib/services";

// Lightweight endpoint for fast polling (~200ms vs ~2s for full fetch)
// Returns only total count and latest ticket key
export async function GET() {
  try {
    const result = await fetchTicketPoll();

    return NextResponse.json({
      success: true,
      total: result.total,
      latestKey: result.latestKey,
      ts: Date.now(),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Poll check failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
