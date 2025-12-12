import { NextRequest, NextResponse } from "next/server";
import { getSchedulerEnabled, setSchedulerEnabled, initDatabase } from "@/lib/services";

export async function GET(_request: NextRequest) {
  try {
    await initDatabase();
    const enabled = await getSchedulerEnabled();

    return NextResponse.json({
      success: true,
      enabled,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDatabase();

    const { enabled } = await request.json();

    if (typeof enabled !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Invalid 'enabled' value. Must be boolean." },
        { status: 400 }
      );
    }

    await setSchedulerEnabled(enabled);

    return NextResponse.json({
      success: true,
      enabled,
      message: `Scheduler ${enabled ? "enabled" : "disabled"} successfully`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
