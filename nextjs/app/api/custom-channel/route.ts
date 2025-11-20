import { NextRequest, NextResponse } from "next/server";
import { getCustomChannelId, setCustomChannelId } from "@/lib/db";

// GET - Retrieve custom channel ID
export async function GET() {
  try {
    const channelId = await getCustomChannelId();
    return NextResponse.json({
      success: true,
      channelId: channelId || null,
    });
  } catch (error: any) {
    console.error("[Custom Channel] Error fetching channel ID:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Set custom channel ID
export async function POST(req: NextRequest) {
  try {
    const { channelId } = await req.json();

    if (!channelId || typeof channelId !== 'string') {
      return NextResponse.json(
        { success: false, error: "Channel ID is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate channel ID format (Slack channel IDs typically start with C)
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
  } catch (error: any) {
    console.error("[Custom Channel] Error setting channel ID:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
