import { NextRequest, NextResponse } from "next/server";
import {
  getEveningUserToken,
  setEveningUserToken,
  getNightUserToken,
  setNightUserToken,
  getEveningMentions,
  setEveningMentions,
  getNightMentions,
  setNightMentions
} from "@/lib/db";

// GET - Retrieve all shift-related settings
export async function GET() {
  try {
    const [eveningToken, nightToken, eveningMentions, nightMentions] = await Promise.all([
      getEveningUserToken(),
      getNightUserToken(),
      getEveningMentions(),
      getNightMentions()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        eveningToken: eveningToken || "",
        nightToken: nightToken || "",
        eveningMentions: eveningMentions || "",
        nightMentions: nightMentions || ""
      }
    });
  } catch (error: any) {
    console.error("[Shift Tokens] Error fetching:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Set shift-related settings
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eveningToken, nightToken, eveningMentions, nightMentions } = body;

    // Update evening token if provided
    if (eveningToken !== undefined) {
      await setEveningUserToken(eveningToken);
    }

    // Update night token if provided
    if (nightToken !== undefined) {
      await setNightUserToken(nightToken);
    }

    // Update evening mentions if provided
    if (eveningMentions !== undefined) {
      await setEveningMentions(eveningMentions);
    }

    // Update night mentions if provided
    if (nightMentions !== undefined) {
      await setNightMentions(nightMentions);
    }

    return NextResponse.json({
      success: true,
      message: "Shift settings updated successfully"
    });
  } catch (error: any) {
    console.error("[Shift Tokens] Error setting:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
