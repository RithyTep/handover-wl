import {
	checkDatabaseHealth,
	checkJiraHealth,
	checkSlackHealth,
} from "@/lib/services"
import type {
	HealthStatus,
	ServiceHealth,
	EnvironmentStatus,
	HealthResponse,
} from "./health.types"

const startTime = Date.now()

export function checkEnvironmentStatus(): EnvironmentStatus {
	return {
		DATABASE_URL: !!process.env.DATABASE_URL,
		JIRA_URL: !!process.env.JIRA_URL,
		JIRA_EMAIL: !!process.env.JIRA_EMAIL,
		JIRA_API_TOKEN: !!process.env.JIRA_API_TOKEN,
		SLACK_BOT_TOKEN: !!process.env.SLACK_BOT_TOKEN,
		SLACK_CHANNEL: !!(process.env.SLACK_CHANNEL_ID || process.env.SLACK_CHANNEL),
	}
}

export function checkAllRequiredVars(envStatus: EnvironmentStatus): boolean {
	return (
		envStatus.DATABASE_URL &&
		envStatus.JIRA_URL &&
		envStatus.JIRA_EMAIL &&
		envStatus.JIRA_API_TOKEN
	)
}

export async function checkDatabase(): Promise<ServiceHealth> {
	const result = await checkDatabaseHealth()
	return {
		status: result.healthy ? "healthy" : "unhealthy",
		latency_ms: result.latency,
		error: result.error,
	}
}

export async function checkJira(allRequiredSet: boolean): Promise<ServiceHealth> {
	if (!allRequiredSet) {
		return {
			status: "unhealthy",
			error: "Missing required configuration",
		}
	}

	const result = await checkJiraHealth()
	return {
		status: result.healthy ? "healthy" : "degraded",
		latency_ms: result.latency,
		error: result.error,
	}
}

export async function checkSlack(hasToken: boolean): Promise<ServiceHealth> {
	if (!hasToken) {
		return {
			status: "degraded",
			error: "Slack not configured",
		}
	}

	const result = await checkSlackHealth()
	return {
		status: result.healthy ? "healthy" : "degraded",
		latency_ms: result.latency,
		error: result.error,
	}
}

export function determineOverallStatus(
	database: HealthStatus,
	jira: HealthStatus,
	slack: HealthStatus
): HealthStatus {
	if (database === "unhealthy" || jira === "unhealthy") {
		return "unhealthy"
	}

	if (database === "degraded" || jira === "degraded" || slack === "degraded") {
		return "degraded"
	}

	return "healthy"
}

interface BuildHealthResponseOptions {
	overallStatus: HealthStatus
	dbHealth: ServiceHealth
	jiraHealth: ServiceHealth
	slackHealth: ServiceHealth
	envStatus: EnvironmentStatus
	allRequiredSet: boolean
}

export function buildHealthResponse(options: BuildHealthResponseOptions): HealthResponse {
	const { overallStatus, dbHealth, jiraHealth, slackHealth, envStatus, allRequiredSet } = options
	return {
		status: overallStatus,
		timestamp: new Date().toISOString(),
		version: process.env.npm_package_version || "3.6.0",
		environment: process.env.NODE_ENV || "development",
		uptime_seconds: Math.floor((Date.now() - startTime) / 1000),
		services: {
			database: dbHealth,
			jira: jiraHealth,
			slack: slackHealth,
		},
		config: {
			all_required_set: allRequiredSet,
			environment_vars: envStatus,
		},
	}
}

export interface DeepHealthCheckResult {
	dbHealth: ServiceHealth
	jiraHealth: ServiceHealth
	slackHealth: ServiceHealth
	overallStatus: HealthStatus
}

export async function performDeepHealthCheck(
	envStatus: EnvironmentStatus,
	allRequiredSet: boolean
): Promise<DeepHealthCheckResult> {
	const dbHealth = await checkDatabase()
	const jiraHealth = await checkJira(allRequiredSet)
	const slackHealth = await checkSlack(envStatus.SLACK_BOT_TOKEN)
	const overallStatus = determineOverallStatus(
		dbHealth.status,
		jiraHealth.status,
		slackHealth.status
	)

	return { dbHealth, jiraHealth, slackHealth, overallStatus }
}

export async function performQuickHealthCheck(): Promise<DeepHealthCheckResult> {
	const dbHealth = await checkDatabase()
	const jiraHealth: ServiceHealth = { status: "healthy" }
	const slackHealth: ServiceHealth = { status: "healthy" }
	const overallStatus = determineOverallStatus(
		dbHealth.status,
		jiraHealth.status,
		slackHealth.status
	)

	return { dbHealth, jiraHealth, slackHealth, overallStatus }
}
