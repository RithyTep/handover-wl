import { NextResponse } from "next/server";
import { initDatabase, loadTicketData, getTicketsWithSavedData } from "@/lib/services";

export async function GET() {
  try {
    await initDatabase();
    const savedData = await loadTicketData();
    const tickets = await getTicketsWithSavedData(savedData);

    return NextResponse.json({
      success: true,
      tickets,
      total: tickets.length,
      storage: "postgresql",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch tickets";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
