import { NextRequest, NextResponse } from "next/server";
import { saveTicketData, initDatabase } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Initialize database table if it doesn't exist
    await initDatabase();

    const data = await request.json();
    console.log("Received save request with keys:", Object.keys(data).length);

    // Convert from status-{key}/action-{key} format to the database structure
    const formattedData: Record<string, { status: string; action: string }> = {};

    Object.keys(data).forEach((key) => {
      if (key.startsWith("status-")) {
        const ticketKey = key.replace("status-", "");
        if (!formattedData[ticketKey]) {
          formattedData[ticketKey] = { status: "--", action: "--" };
        }
        formattedData[ticketKey].status = data[key];
      } else if (key.startsWith("action-")) {
        const ticketKey = key.replace("action-", "");
        if (!formattedData[ticketKey]) {
          formattedData[ticketKey] = { status: "--", action: "--" };
        }
        formattedData[ticketKey].action = data[key];
      }
    });

    console.log("Saving to database, tickets:", Object.keys(formattedData).length);

    await saveTicketData(formattedData);

    console.log("Successfully saved to database");

    return NextResponse.json({
      success: true,
      ticketCount: Object.keys(formattedData).length,
      storage: "postgresql"
    });
  } catch (error: any) {
    console.error("Error saving data:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
