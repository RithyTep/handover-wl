import { NextRequest, NextResponse } from "next/server";
import {
  getEveningUserToken,
  setEveningUserToken,
  getNightUserToken,
  setNightUserToken,
  getEveningMentions,
  setEveningMentions,
  getNightMentions,
  setNightMentions,
} from "@/lib/services";

export async function GET() {
  try {
    const [eveningToken, nightToken, eveningMentions, nightMentions] = await Promise.all([
      getEveningUserToken(),
      getNightUserToken(),
      getEveningMentions(),
      getNightMentions(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        eveningToken: eveningToken || "",
        nightToken: nightToken || "",
        eveningMentions: eveningMentions || "",
        nightMentions: nightMentions || "",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eveningToken, nightToken, eveningMentions, nightMentions } = body;

    if (eveningToken !== undefined) {
      await setEveningUserToken(eveningToken);
    }
    if (nightToken !== undefined) {
      await setNightUserToken(nightToken);
    }
    if (eveningMentions !== undefined) {
      await setEveningMentions(eveningMentions);
    }
    if (nightMentions !== undefined) {
      await setNightMentions(nightMentions);
    }

    return NextResponse.json({
      success: true,
      message: "Shift settings updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
