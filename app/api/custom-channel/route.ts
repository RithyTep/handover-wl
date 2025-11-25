import { NextRequest, NextResponse } from "next/server";
import { getCustomChannelId, setCustomChannelId } from "@/lib/services";

export async function GET() {
  try {
    const channelId = await getCustomChannelId();
    return NextResponse.json({
      success: true,
      channelId: channelId || null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { channelId } = await req.json();

    if (!channelId || typeof channelId !== "string") {
      return NextResponse.json(
        { success: false, error: "Channel ID is required and must be a string" },
        { status: 400 }
      );
    }

    if (!channelId.match(/^[A-Z0-9]+$/)) {
      return NextResponse.json(
        { success: false, error: "Invalid channel ID format. Expected format: C08TWKP6ZK7" },
        { status: 400 }
      );
    }

    await setCustomChannelId(channelId);

    return NextResponse.json({
      success: true,
      channelId: channelId,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
