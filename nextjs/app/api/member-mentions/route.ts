import { NextRequest, NextResponse } from "next/server";
import { getMemberMentions, setMemberMentions } from "@/lib/db";

// GET - Retrieve member mentions
export async function GET() {
  try {
    const mentions = await getMemberMentions();
    return NextResponse.json({
      success: true,
      mentions: mentions || "",
    });
  } catch (error: any) {
    console.error("[Member Mentions] Error fetching mentions:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Set member mentions
export async function POST(req: NextRequest) {
  try {
    const { mentions } = await req.json();

    if (typeof mentions !== 'string') {
      return NextResponse.json(
        { success: false, error: "Mentions must be a string" },
        { status: 400 }
      );
    }

    await setMemberMentions(mentions);

    return NextResponse.json({
      success: true,
      mentions: mentions,
    });
  } catch (error: any) {
    console.error("[Member Mentions] Error setting mentions:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
