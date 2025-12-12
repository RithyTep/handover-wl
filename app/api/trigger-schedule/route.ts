import { NextRequest, NextResponse } from "next/server"
import { triggerScheduledTask } from "@/lib/scheduler"
import { logger } from "@/lib/logger"
import { rateLimit, getClientIP, getRateLimitHeaders } from "@/lib/security/rate-limit"

const log = logger.scheduler

const TRIGGER_RATE_LIMIT = 5
const TRIGGER_RATE_WINDOW_MS = 60000

export async function POST(request: NextRequest) {
	const ip = getClientIP(request)
	const rateLimitResult = rateLimit(ip, TRIGGER_RATE_LIMIT, TRIGGER_RATE_WINDOW_MS)

	if (!rateLimitResult.success) {
		return NextResponse.json(
			{ success: false, error: "Rate limit exceeded. Please try again later." },
			{
				status: 429,
				headers: getRateLimitHeaders(rateLimitResult, TRIGGER_RATE_LIMIT),
			}
		)
	}

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
