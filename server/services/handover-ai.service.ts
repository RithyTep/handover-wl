import { getAIConfig } from "@/lib/env"
import { saveTicketData } from "@/lib/services"
import type { Ticket } from "@/lib/types"
import { AIAutofillService } from "./ai-autofill.service"

interface FillResult {
	tickets: Ticket[]
	filledCount: number
}

function convertTicketToAIRequest(ticket: Ticket) {
	return {
		key: ticket.key,
		summary: ticket.summary,
		status: ticket.status,
		assignee: ticket.assignee,
		issueType: ticket.issueType,
		wlMainTicketType: ticket.wlMainTicketType,
		wlSubTicketType: ticket.wlSubTicketType,
		customerLevel: ticket.customerLevel,
		created: ticket.created,
		dueDate: ticket.dueDate,
	}
}

export async function ensureHandoverTicketsFilled(
	tickets: Ticket[]
): Promise<FillResult> {
	const missing = tickets.filter(
		(t) => t.savedStatus === "--" || t.savedAction === "--"
	)

	if (missing.length === 0) {
		return { tickets, filledCount: 0 }
	}

	const config = getAIConfig()
	if (!config.apiKey) {
		throw new Error(
			`${config.provider.toUpperCase()} API key not configured. Please set ${
				config.provider === "groq" ? "GROQ_API_KEY" : "OPENAI_API_KEY"
			} environment variable.`
		)
	}

	const aiService = new AIAutofillService()
	const results: Record<string, { status: string; action: string }> = {}

	for (const ticket of missing) {
		try {
			const { suggestion } = await aiService.generateSuggestion(
				convertTicketToAIRequest(ticket)
			)
			results[ticket.key] = {
				status: suggestion.status,
				action: suggestion.action,
			}
		} catch (error) {
			const fallback = aiService.getFallbackSuggestion()
			results[ticket.key] = {
				status: fallback.status,
				action: fallback.action,
			}
		}
	}

	if (Object.keys(results).length > 0) {
		await saveTicketData(results)
	}

	const updatedTickets = tickets.map((ticket) => {
		const filled = results[ticket.key]
		if (!filled) return ticket
		return {
			...ticket,
			savedStatus: filled.status,
			savedAction: filled.action,
		}
	})

	return { tickets: updatedTickets, filledCount: Object.keys(results).length }
}
