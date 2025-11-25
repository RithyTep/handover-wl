import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const STORAGE_FILE = path.join(process.cwd(), "../ticket_data.json");

export async function GET() {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, "utf8");
      const jsonData = JSON.parse(data);

      return new NextResponse(JSON.stringify(jsonData, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return NextResponse.json(
        { error: "ticket_data.json not found" },
        { status: 404 }
      );
    }
  } catch (error: unknown) {
    console.error("Error reading ticket_data.json:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to read ticket data", details: message },
      { status: 500 }
    );
  }
}
