import { getAIConfig } from "@/lib/env"
import { saveTicketData } from "@/lib/services"
import type { Ticket } from "@/lib/types"
import { AIAutofillService } from "./ai-autofill.service"

interface FillResult {
	tickets: Ticket[]
	filledCount: number
}

function isMissing(value?: string | null): boolean {
	if (!value) return true
	return value.trim() === "" || value.trim() === "--"
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
		(t) => isMissing(t.savedStatus) || isMissing(t.savedAction)
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
		const needsStatus = isMissing(ticket.savedStatus)
		const needsAction = isMissing(ticket.savedAction)

		try {
			const { suggestion } = await aiService.generateSuggestion(
				convertTicketToAIRequest(ticket)
			)
			results[ticket.key] = {
				status: needsStatus ? suggestion.status : ticket.savedStatus,
				action: needsAction ? suggestion.action : ticket.savedAction,
			}
		} catch (error) {
			const fallback = aiService.getFallbackSuggestion()
			results[ticket.key] = {
				status: needsStatus ? fallback.status : ticket.savedStatus,
				action: needsAction ? fallback.action : ticket.savedAction,
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
