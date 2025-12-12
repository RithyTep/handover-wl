/**
 * API Response Utilities
 * Standardized response handling for all API routes
 *
 * Usage:
 *   import { apiSuccess, apiError, handleApiError } from "@/lib/api/response"
 *
 *   // Success response
 *   return apiSuccess({ data: result })
 *
 *   // Error response
 *   return apiError("Invalid input", 400)
 *
 *   // Handle caught errors
 *   catch (error) {
 *     return handleApiError(error, "POST /api/example")
 *   }
 */

import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"

/**
 * Standard API response structure
 */
export interface ApiResponse<T = unknown> {
	success: boolean
	data?: T
	error?: string
	code?: string
}

/**
 * Create a successful API response
 */
export function apiSuccess<T extends Record<string, unknown>>(
	data: T,
	status: number = 200
): NextResponse<ApiResponse<T>> {
	return NextResponse.json({ success: true, ...data }, { status })
}

/**
 * Create an error API response
 */
export function apiError(
	message: string,
	status: number = 500,
	code?: string
): NextResponse<ApiResponse<never>> {
	const response: ApiResponse<never> = {
		success: false,
		error: message,
	}
	if (code) {
		response.code = code
	}
	return NextResponse.json(response, { status })
}

/**
 * Create a bad request (400) error response
 */
export function badRequest(message: string): NextResponse<ApiResponse<never>> {
	return apiError(message, 400, "BAD_REQUEST")
}

/**
 * Create an unauthorized (401) error response
 */
export function unauthorized(
	message: string = "Unauthorized"
): NextResponse<ApiResponse<never>> {
	return apiError(message, 401, "UNAUTHORIZED")
}

/**
 * Create a not found (404) error response
 */
export function notFound(
	message: string = "Not found"
): NextResponse<ApiResponse<never>> {
	return apiError(message, 404, "NOT_FOUND")
}

/**
 * Create a conflict (409) error response
 */
export function conflict(message: string): NextResponse<ApiResponse<never>> {
	return apiError(message, 409, "CONFLICT")
}

/**
 * Create an internal server error (500) response
 */
export function serverError(
	message: string = "Internal server error"
): NextResponse<ApiResponse<never>> {
	return apiError(message, 500, "INTERNAL_ERROR")
}

/**
 * Handle caught errors with consistent logging and response formatting
 *
 * @param error - The caught error
 * @param context - Context string for logging (e.g., "POST /api/tickets")
 * @returns Formatted error response
 */
export function handleApiError(
	error: unknown,
	context: string
): NextResponse<ApiResponse<never>> {
	const message = error instanceof Error ? error.message : "Unknown error"

	logger.api.error(`${context}: ${message}`, {
		error: error instanceof Error ? error.stack : String(error),
	})

	// Handle specific error types
	if (error instanceof Error) {
		// API key errors
		if (
			message.includes("API key") ||
			message.includes("Unauthorized") ||
			(error as { status?: number }).status === 401
		) {
			return apiError(message, 401, "UNAUTHORIZED")
		}

		// Validation errors
		if (
			message.includes("required") ||
			message.includes("Invalid") ||
			message.includes("missing")
		) {
			return apiError(message, 400, "VALIDATION_ERROR")
		}
	}

	return serverError(message)
}

/**
 * Wrap an async handler with error handling
 *
 * Usage:
 *   export const POST = withErrorHandling("POST /api/example", async (request) => {
 *     // Your logic here
 *     return apiSuccess({ data: result })
 *   })
 */
export function withErrorHandling<T>(
	context: string,
	handler: (request: Request) => Promise<NextResponse<T>>
) {
	return async (request: Request): Promise<NextResponse<T | ApiResponse<never>>> => {
		try {
			return await handler(request)
		} catch (error) {
			return handleApiError(error, context)
		}
	}
}
