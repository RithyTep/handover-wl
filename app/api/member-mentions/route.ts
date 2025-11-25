import { NextRequest, NextResponse } from "next/server";
import { getMemberMentions, setMemberMentions } from "@/lib/services";

export async function GET() {
  try {
    const mentions = await getMemberMentions();
    return NextResponse.json({
      success: true,
      mentions: mentions || "",
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
    const { mentions } = await req.json();

    if (typeof mentions !== "string") {
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
