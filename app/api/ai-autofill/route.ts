import { NextResponse } from "next/server"
import { AIAutofillService } from "@/server/services"
import { apiSuccess, badRequest, handleApiError } from "@/lib/api"
import { getAIConfig } from "@/lib/env"
import { rateLimit, getClientIP, getRateLimitHeaders } from "@/lib/security/rate-limit"
import type { AIAutofillRequest } from "@/lib/types"

const aiAutofillService = new AIAutofillService()
const AI_RATE_LIMIT = 30
const AI_RATE_WINDOW_MS = 60000

export async function POST(request: Request) {
	const ip = getClientIP(request)
	const rateLimitResult = rateLimit(ip, AI_RATE_LIMIT, AI_RATE_WINDOW_MS)

	if (!rateLimitResult.success) {
		return NextResponse.json(
			{ success: false, error: "Rate limit exceeded. Please try again later." },
			{
				status: 429,
				headers: getRateLimitHeaders(rateLimitResult, AI_RATE_LIMIT),
			}
		)
	}

	try {
		const body = (await request.json()) as Partial<AIAutofillRequest>
		const { ticket } = body

		if (!ticket) {
			return badRequest("Ticket data is required")
		}

		const { suggestion, debug } =
			await aiAutofillService.generateSuggestion(ticket)

		return apiSuccess({
			suggestion,
			debug,
		})
	} catch (error: unknown) {
		const config = getAIConfig()

		const apiError = error as { status?: number }
		if (apiError.status === 401) {
			return handleApiError(
				new Error(
					`Invalid ${config.provider.toUpperCase()} API key. Please check your ${
						config.provider === "groq" ? "GROQ_API_KEY" : "OPENAI_API_KEY"
					} environment variable.`
				),
				"POST /api/ai-autofill"
			)
		}

		const message =
			error instanceof Error ? error.message : "Failed to generate suggestion"

		return NextResponse.json(
			{
				success: false,
				error: message,
				suggestion: aiAutofillService.getFallbackSuggestion(),
			},
			{ status: 500 }
		)
	}
}
