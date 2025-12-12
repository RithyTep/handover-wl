import { NextRequest, NextResponse } from "next/server"
import { initDatabase, getThemePreference, setThemePreference } from "@/lib/services/database"
import { logger } from "@/lib/logger"
import type { Theme } from "@/lib/types"

const log = logger.api

export async function GET() {
	try {
		await initDatabase()
		const theme = await getThemePreference()
		return NextResponse.json({ success: true, theme })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Theme GET error", { error: message })
		return NextResponse.json(
			{ success: false, error: "Failed to get theme preference" },
			{ status: 500 }
		)
	}
}

export async function POST(request: NextRequest) {
	try {
		await initDatabase()
		const body = await request.json()
		const { theme } = body

		if (!theme || (theme !== "default" && theme !== "christmas")) {
			return NextResponse.json(
				{ success: false, error: "Invalid theme. Must be 'default' or 'christmas'" },
				{ status: 400 }
			)
		}

		await setThemePreference(theme as Theme)

		return NextResponse.json({
			success: true,
			theme
		})
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Theme POST error", { error: message })
		return NextResponse.json(
			{ success: false, error: "Failed to set theme preference" },
			{ status: 500 }
		)
	}
}
