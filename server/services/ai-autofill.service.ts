import OpenAI from "openai"
import { getAIConfig } from "@/lib/env"
import { createLogger } from "@/lib/logger"
import {
	type AISuggestion,
	type AIAutofillRequest,
	aiSuggestionSchema,
} from "@/lib/types/ai-autofill"
import { fetchTicketHistory } from "./jira-history.service"
import { buildTicketContext, buildAIPrompt, getSystemMessage } from "./ai-prompt.service"

const logger = createLogger("AIAutofill")

function createAIClient(): OpenAI | null {
	const config = getAIConfig()

	if (!config.apiKey) {
		return null
	}

	return new OpenAI({
		apiKey: config.apiKey,
		...(config.baseUrl && { baseURL: config.baseUrl }),
	})
}

async function generateAISuggestion(
	client: OpenAI,
	prompt: string
): Promise<AISuggestion> {
	const config = getAIConfig()

	const completion = await client.chat.completions.create({
		model: config.model,
		messages: [
			{
				role: "system",
				content: getSystemMessage(),
			},
			{
				role: "user",
				content: prompt,
			},
		],
		temperature: 0.3,
		max_tokens: 300,
		response_format: { type: "json_object" },
	})

	const response = completion.choices[0]?.message?.content

	if (!response) {
		throw new Error("No response from AI provider")
	}

	let parsed: unknown
	try {
		parsed = JSON.parse(response)
	} catch {
		logger.error("Failed to parse AI response", { response })
		throw new Error("Invalid JSON response from AI")
	}

	const result = aiSuggestionSchema.safeParse(parsed)
	if (!result.success) {
		logger.error("Invalid AI response structure", { parsed })
		throw new Error("AI response does not match expected schema")
	}

	return {
		status: (result.data.status?.trim() || "Pending review - check ticket details").slice(0, 200),
		action: (result.data.action?.trim() || "Review ticket and determine next steps").slice(0, 200),
	}
}

export class AIAutofillService {
	async generateSuggestion(ticket: AIAutofillRequest["ticket"]): Promise<{
		suggestion: AISuggestion
		debug: {
			hasComments: number
			hasStatusChanges: number
			wordCounts: { status: number; action: number }
		}
	}> {
		const config = getAIConfig()

		if (!config.apiKey) {
			throw new Error(
				`${config.provider.toUpperCase()} API key not configured. Please set ${
					config.provider === "groq" ? "GROQ_API_KEY" : "OPENAI_API_KEY"
				} environment variable.`
			)
		}

		const client = createAIClient()
		if (!client) {
			throw new Error("Invalid AI provider configured")
		}

		logger.info(`Generating suggestion for ticket: ${ticket.key}`)

		const history = await fetchTicketHistory(ticket.key)

		const { context } = buildTicketContext(ticket, history)
		const prompt = buildAIPrompt(context)

		const suggestion = await generateAISuggestion(client, prompt)

		const debug = {
			hasComments: history?.comments.length || 0,
			hasStatusChanges: history?.statusChanges.length || 0,
			wordCounts: {
				status: suggestion.status.split(/\s+/).length,
				action: suggestion.action.split(/\s+/).length,
			},
		}

		logger.info(`Generated suggestion for ${ticket.key}`, debug)

		return { suggestion, debug }
	}

	getFallbackSuggestion(): AISuggestion {
		return {
			status: "Error generating status - please review ticket manually",
			action: "Manually review ticket history and add handover notes",
		}
	}
}
