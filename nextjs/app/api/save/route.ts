import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const STORAGE_FILE = path.join(process.cwd(), "../ticket_data.json");

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Convert from status-{key}/action-{key} format to the JSON structure
    const formattedData: Record<string, any> = {};

    Object.keys(data).forEach((key) => {
      if (key.startsWith("status-")) {
        const ticketKey = key.replace("status-", "");
        if (!formattedData[ticketKey]) {
          formattedData[ticketKey] = { status: "--", action: "--", updated_at: new Date().toISOString() };
        }
        formattedData[ticketKey].status = data[key];
        formattedData[ticketKey].updated_at = new Date().toISOString();
      } else if (key.startsWith("action-")) {
        const ticketKey = key.replace("action-", "");
        if (!formattedData[ticketKey]) {
          formattedData[ticketKey] = { status: "--", action: "--", updated_at: new Date().toISOString() };
        }
        formattedData[ticketKey].action = data[key];
        formattedData[ticketKey].updated_at = new Date().toISOString();
      }
    });

    fs.writeFileSync(STORAGE_FILE, JSON.stringify(formattedData, null, 2));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error saving data:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
