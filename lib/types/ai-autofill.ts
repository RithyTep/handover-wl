import { z } from "zod"

/**
 * AI Autofill Types
 * Types for the AI-powered ticket autofill feature
 */

// ============================================
// Jira Data Types
// ============================================

/**
 * Raw Jira comment from API
 */
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

/**
 * Atlassian Document Format (ADF) node
 */
export interface AdfNode {
	type: string
	text?: string
	content?: AdfNode[]
}

/**
 * Processed comment for AI context
 */
export interface ProcessedComment {
	id: string
	author: string
	body: string
	created: string
	createdRaw: string
	updated: string | null
}

/**
 * Status change from Jira changelog
 */
export interface StatusChange {
	from: string | undefined
	to: string | undefined
	date: string
	author: string
}

/**
 * Assignee change from Jira changelog
 */
export interface AssigneeChange {
	from: string
	to: string
	date: string
}

/**
 * Ticket history from Jira
 */
export interface TicketHistory {
	comments: ProcessedComment[]
	statusChanges: StatusChange[]
	assigneeChanges: AssigneeChange[]
	description: string
}

// ============================================
// AI Response Types
// ============================================

/**
 * AI suggestion response schema
 */
export const aiSuggestionSchema = z.object({
	status: z.string(),
	action: z.string(),
})

export type AISuggestion = z.infer<typeof aiSuggestionSchema>

/**
 * AI autofill request body
 */
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

/**
 * AI autofill response
 */
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

// ============================================
// Configuration Types
// ============================================

/**
 * AI Provider type
 */
export type AIProvider = "groq" | "openai"

/**
 * AI client configuration
 */
export interface AIClientConfig {
	provider: AIProvider
	apiKey: string | undefined
	baseUrl?: string
	model: string
}
