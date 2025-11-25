import { NextRequest, NextResponse } from "next/server";
import { getTriggerTimes, setTriggerTimes } from "@/lib/services";

export async function GET() {
  try {
    const times = await getTriggerTimes();
    return NextResponse.json({ success: true, times });
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
    const { time1, time2 } = body;

    if (!time1 || !time2) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: time1, time2" },
        { status: 400 }
      );
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time1) || !timeRegex.test(time2)) {
      return NextResponse.json(
        { success: false, error: "Invalid time format. Use HH:mm (e.g., 17:10)" },
        { status: 400 }
      );
    }

    await setTriggerTimes(time1, time2);

    return NextResponse.json({
      success: true,
      message: "Trigger times updated",
      times: { time1, time2 },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
