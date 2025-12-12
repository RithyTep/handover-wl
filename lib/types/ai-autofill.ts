import { z } from "zod"

export interface JiraRawComment {
	id: string
	author?: {
		displayName?: string
		name?: string
		accountType?: string
	}
	body?: AdfNode | string
	created: string
	updated?: string
}

export interface AdfNode {
	type: string
	text?: string
	content?: AdfNode[]
}

export interface ProcessedComment {
	id: string
	author: string
	body: string
	created: string
	createdRaw: string
	updated: string | null
}

export interface StatusChange {
	from: string | undefined
	to: string | undefined
	date: string
	author: string
}

export interface AssigneeChange {
	from: string
	to: string
	date: string
}

export interface TicketHistory {
	comments: ProcessedComment[]
	statusChanges: StatusChange[]
	assigneeChanges: AssigneeChange[]
	description: string
}

export const aiSuggestionSchema = z.object({
	status: z.string(),
	action: z.string(),
})

export type AISuggestion = z.infer<typeof aiSuggestionSchema>

export interface AIAutofillRequest {
	ticket: {
		key: string
		summary: string
		status: string
		assignee: string
		wlMainTicketType?: string
		wlSubTicketType?: string
		customerLevel?: string
		created: string
		dueDate?: string | null
	}
}

export interface AIAutofillResponse {
	success: boolean
	suggestion?: AISuggestion
	debug?: {
		hasComments: number
		hasStatusChanges: number
		wordCounts: {
			status: number
			action: number
		}
	}
	error?: string
}

export type AIProvider = "groq" | "openai"

export interface AIClientConfig {
	provider: AIProvider
	apiKey: string | undefined
	baseUrl?: string
	model: string
}
