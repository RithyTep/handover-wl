import { NextResponse } from "next/server"
import { AIAutofillService } from "@/server/services"
import { apiSuccess, badRequest, handleApiError } from "@/lib/api"
import { getAIConfig } from "@/lib/env"
import type { AIAutofillRequest } from "@/lib/types"

const aiAutofillService = new AIAutofillService()

export async function POST(request: Request) {
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
