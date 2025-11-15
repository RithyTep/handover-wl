import { NextRequest, NextResponse } from "next/server";
import { triggerScheduledTask } from "@/lib/scheduler";

export async function POST(request: NextRequest) {
  try {
    console.log("[Manual Trigger] Triggering scheduled task manually...");

    await triggerScheduledTask();

    return NextResponse.json({
      success: true,
      message: "Scheduled task triggered manually",
      triggeredAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Manual Trigger] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
