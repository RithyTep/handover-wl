export type HealthStatus = "healthy" | "unhealthy" | "degraded"

export interface ServiceHealth {
	status: HealthStatus
	latency_ms?: number
	error?: string
}

export interface EnvironmentStatus {
	DATABASE_URL: boolean
	JIRA_URL: boolean
	JIRA_EMAIL: boolean
	JIRA_API_TOKEN: boolean
	SLACK_BOT_TOKEN: boolean
	SLACK_CHANNEL: boolean
}

export interface HealthResponse {
	status: HealthStatus
	timestamp: string
	version: string
	environment: string
	uptime_seconds: number
	services: {
		database: ServiceHealth
		jira: ServiceHealth
		slack: ServiceHealth
	}
	config: {
		all_required_set: boolean
		environment_vars: EnvironmentStatus
	}
}
