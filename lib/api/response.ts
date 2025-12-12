import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"

export interface ApiResponse<T = unknown> {
	success: boolean
	data?: T
	error?: string
	code?: string
}

export function apiSuccess<T extends Record<string, unknown>>(
	data: T,
	status: number = 200
): NextResponse<ApiResponse<T>> {
	return NextResponse.json({ success: true, ...data }, { status })
}

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

export function badRequest(message: string): NextResponse<ApiResponse<never>> {
	return apiError(message, 400, "BAD_REQUEST")
}

export function unauthorized(
	message: string = "Unauthorized"
): NextResponse<ApiResponse<never>> {
	return apiError(message, 401, "UNAUTHORIZED")
}

export function notFound(
	message: string = "Not found"
): NextResponse<ApiResponse<never>> {
	return apiError(message, 404, "NOT_FOUND")
}

export function conflict(message: string): NextResponse<ApiResponse<never>> {
	return apiError(message, 409, "CONFLICT")
}

export function serverError(
	message: string = "Internal server error"
): NextResponse<ApiResponse<never>> {
	return apiError(message, 500, "INTERNAL_ERROR")
}

export function handleApiError(
	error: unknown,
	context: string
): NextResponse<ApiResponse<never>> {
	const message = error instanceof Error ? error.message : "Unknown error"

	logger.api.error(`${context}: ${message}`, {
		error: error instanceof Error ? error.stack : String(error),
	})

	if (error instanceof Error) {
		if (
			message.includes("API key") ||
			message.includes("Unauthorized") ||
			(error as { status?: number }).status === 401
		) {
			return apiError(message, 401, "UNAUTHORIZED")
		}

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
