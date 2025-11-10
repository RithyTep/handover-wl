import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Use Railway volume if available, otherwise fall back to local directory
// Railway mounts volumes at /mnt
const STORAGE_DIR = fs.existsSync("/mnt") ? "/mnt" : process.cwd();
const STORAGE_FILE = path.join(STORAGE_DIR, "ticket_data.json");

console.log("Storage directory:", STORAGE_DIR);
console.log("Storage file:", STORAGE_FILE);

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
