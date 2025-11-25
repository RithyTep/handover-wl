import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const ACHIEVEMENTS_FILE = path.join(process.cwd(), "achievements_data.json");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { achievements } = body;

    if (!achievements || !Array.isArray(achievements)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid achievements data",
        },
        { status: 400 }
      );
    }

    // Save to file
    await fs.writeFile(
      ACHIEVEMENTS_FILE,
      JSON.stringify(achievements, null, 2),
      "utf-8"
    );

    return NextResponse.json({
      success: true,
      message: "Achievements saved successfully",
    });
  } catch (error: any) {
    console.error("Error saving achievements:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
