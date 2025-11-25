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
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch tickets",
      },
      { status: 500 }
    );
  }
}
