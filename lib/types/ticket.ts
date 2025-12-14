import { z } from "zod"

export const ticketDataSchema = z.object({
	status: z.string(),
	action: z.string(),
	updated_at: z.string().optional(),
})

export const ticketDataMapSchema = z.record(z.string(), ticketDataSchema)

export type TicketData = z.infer<typeof ticketDataSchema>
export type TicketDataMap = z.infer<typeof ticketDataMapSchema>

export interface Ticket {
	key: string
	summary: string
	status: string
	assignee: string
	assigneeAvatar: string | null
	created: string
	dueDate: string | null
	releaseDate: string | null
	issueType: string
	wlMainTicketType: string
	wlSubTicketType: string
	customerLevel: string
	jiraUrl: string
	savedStatus: string
	savedAction: string
}

export interface JiraIssue {
	key: string
	fields: {
		summary: string
		status: { name: string }
		assignee?: {
			displayName: string
			avatarUrls?: { "48x48"?: string }
		}
		created: string
		duedate?: string
		issuetype?: { name: string }
		[key: string]: unknown
	}
}

export interface JiraComment {
	author: {
		displayName: string
		accountId: string
	}
	body: {
		content?: Array<{
			content?: Array<{
				text?: string
			}>
		}>
	}
	created: string
}
