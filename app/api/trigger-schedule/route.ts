import { NextRequest, NextResponse } from "next/server"
import { triggerScheduledTask } from "@/lib/scheduler"
import { logger } from "@/lib/logger"

const log = logger.scheduler

export async function POST(_request: NextRequest) {
	try {
		log.info("Manual trigger initiated")

		await triggerScheduledTask()

		return NextResponse.json({
			success: true,
			message: "Scheduled task triggered manually",
			triggeredAt: new Date().toISOString(),
		})
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Manual trigger error", { error: message })
		return NextResponse.json(
			{ success: false, error: message },
			{ status: 500 }
		)
	}
}
