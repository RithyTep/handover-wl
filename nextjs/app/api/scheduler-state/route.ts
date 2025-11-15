import { NextRequest, NextResponse } from "next/server";
import { getSchedulerEnabled, setSchedulerEnabled, initDatabase } from "@/lib/db";

// GET - Get scheduler enabled state
export async function GET(request: NextRequest) {
  try {
    await initDatabase(); // Ensure tables exist
    const enabled = await getSchedulerEnabled();

    return NextResponse.json({
      success: true,
      enabled,
    });
  } catch (error: any) {
    console.error("[Scheduler State] Error getting state:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Update scheduler enabled state
export async function POST(request: NextRequest) {
  try {
    await initDatabase(); // Ensure tables exist

    const { enabled } = await request.json();

    if (typeof enabled !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Invalid 'enabled' value. Must be boolean." },
        { status: 400 }
      );
    }

    await setSchedulerEnabled(enabled);

    console.log(`[Scheduler State] Updated to: ${enabled}`);

    return NextResponse.json({
      success: true,
      enabled,
      message: `Scheduler ${enabled ? "enabled" : "disabled"} successfully`,
    });
  } catch (error: any) {
    console.error("[Scheduler State] Error updating state:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
