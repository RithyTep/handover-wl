import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const ACHIEVEMENTS_FILE = path.join(process.cwd(), "achievements_data.json");

export async function POST(request: NextRequest) {
  try {
    // Delete the file if it exists
    try {
      await fs.unlink(ACHIEVEMENTS_FILE);
    } catch (error) {
      // File might not exist, that's okay
    }

    return NextResponse.json({
      success: true,
      message: "Achievements cleared successfully",
    });
  } catch (error: any) {
    console.error("Error clearing achievements:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
