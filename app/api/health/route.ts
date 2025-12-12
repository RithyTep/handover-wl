import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import {
	checkEnvironmentStatus,
	checkAllRequiredVars,
	buildHealthResponse,
	performDeepHealthCheck,
	performQuickHealthCheck,
} from "@/lib/health"

const log = logger.api

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const deep = searchParams.get("deep") === "true"
	const simple = searchParams.get("format") === "simple"

	const timer = log.time("Health check")

	const envStatus = checkEnvironmentStatus()
	const allRequiredSet = checkAllRequiredVars(envStatus)

	const { dbHealth, jiraHealth, slackHealth, overallStatus } = deep
		? await performDeepHealthCheck(envStatus, allRequiredSet)
		: await performQuickHealthCheck()

	timer.end("Health check completed", { status: overallStatus })

	if (simple) {
		return new NextResponse(overallStatus, {
			status: overallStatus === "healthy" ? 200 : 503,
			headers: { "Content-Type": "text/plain" },
		})
	}

	const response = buildHealthResponse({
		overallStatus,
		dbHealth,
		jiraHealth,
		slackHealth,
		envStatus,
		allRequiredSet,
	})

	return NextResponse.json(response, {
		status: overallStatus === "healthy" ? 200 : 503,
		headers: {
			"Cache-Control": "no-cache, no-store, must-revalidate",
			Pragma: "no-cache",
			Expires: "0",
		},
	})
}
