import { z } from "zod"

export interface ApiResponse<T = unknown> {
	success: boolean
	data?: T
	error?: string
}

export interface ApiError {
	message: string
	code?: string
	status?: number
}

export const healthCheckResponseSchema = z.object({
	healthy: z.boolean(),
	latency: z.number(),
	error: z.string().optional(),
})

export type HealthCheckResponse = z.infer<typeof healthCheckResponseSchema>

export interface ServiceHealth {
	name: string
	status: "healthy" | "unhealthy" | "degraded"
	latency?: number
	error?: string
}

export interface HealthStatus {
	status: "healthy" | "unhealthy" | "degraded"
	timestamp: string
	services: ServiceHealth[]
}
