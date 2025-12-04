import { NextRequest, NextResponse } from "next/server";
import { initDatabase, getThemePreference, setThemePreference } from "@/lib/services/database";
import type { Theme } from "@/lib/types";

export async function GET() {
  try {
    await initDatabase();
    const theme = await getThemePreference();
    return NextResponse.json({ success: true, theme });
  } catch (error) {
    console.error("[Theme API] Error getting theme:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get theme preference" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    const body = await request.json();
    const { theme } = body;

    if (!theme || (theme !== "default" && theme !== "christmas")) {
      return NextResponse.json(
        { success: false, error: "Invalid theme. Must be 'default' or 'christmas'" },
        { status: 400 }
      );
    }

    await setThemePreference(theme as Theme);

    return NextResponse.json({
      success: true,
      theme
    });
  } catch (error) {
    console.error("[Theme API] Error setting theme:", error);
    return NextResponse.json(
      { success: false, error: "Failed to set theme preference" },
      { status: 500 }
    );
  }
}
