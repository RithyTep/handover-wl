import { getJiraConfig } from "@/lib/env"
import { createLogger } from "@/lib/logger"
import {
	type AdfNode,
	type JiraRawComment,
	type ProcessedComment,
	type StatusChange,
	type AssigneeChange,
	type TicketHistory,
} from "@/lib/types/ai-autofill"

const logger = createLogger("JiraHistory")

export function extractTextFromAdf(node: AdfNode): string {
	let text = ""

	if (node.type === "text" && typeof node.text === "string") {
		text += node.text + " "
	}

	if (Array.isArray(node.content)) {
		for (const child of node.content) {
			text += extractTextFromAdf(child)
		}
	}

	if (["paragraph", "heading", "listItem"].includes(node.type)) {
		text += "\n"
	}

	return text
}

export function extractCommentText(body: AdfNode | string | undefined): string {
	if (!body) return ""

	if (typeof body === "string") {
		return body
	}

	if (typeof body === "object" && "content" in body && Array.isArray(body.content)) {
		let text = ""
		for (const node of body.content) {
			text += extractTextFromAdf(node as AdfNode)
		}
		return text.trim()
	}

	return ""
}

export function extractDescription(
	description: AdfNode | string | undefined
): string {
	if (!description) return ""

	if (typeof description === "string") {
		return description
	}

	if (
		typeof description === "object" &&
		"content" in description &&
		Array.isArray(description.content)
	) {
		let text = ""
		for (const node of description.content) {
			text += extractTextFromAdf(node as AdfNode)
		}
		return text.trim()
	}

	return ""
}

function isBotAuthor(author: JiraRawComment["author"]): boolean {
	if (!author) return false

	const authorName = (author.displayName || author.name || "").toLowerCase()

	return (
		authorName.includes("rovo") ||
		authorName.includes("bot") ||
		authorName.includes("automation") ||
		author.accountType === "app"
	)
}

export function processComments(
	rawComments: JiraRawComment[],
	limit: number = 5
): ProcessedComment[] {
	const humanComments = rawComments.filter((c) => !isBotAuthor(c.author))

	logger.debug(
		`Filtered ${rawComments.length - humanComments.length} bot comments`,
		{
			total: rawComments.length,
			human: humanComments.length,
		}
	)

	return humanComments.slice(-limit).map((c) => ({
		id: c.id,
		author: c.author?.displayName || c.author?.name || "Unknown",
		body: extractCommentText(c.body),
		created: new Date(c.created).toLocaleDateString(),
		createdRaw: c.created,
		updated: c.updated ? new Date(c.updated).toLocaleDateString() : null,
	}))
}

type ChangelogEntry = {
	items?: Array<{ field: string; fromString?: string; toString?: string }>
	created: string
	author?: { displayName?: string }
}

export function extractStatusChanges(
	changelog: ChangelogEntry[],
	limit: number = 3
): StatusChange[] {
	return changelog
		.filter((h) => h.items?.some((i) => i.field === "status"))
		.slice(-limit)
		.map((h) => {
			const statusItem = h.items?.find((i) => i.field === "status")
			return {
				from: statusItem?.fromString,
				to: statusItem?.toString,
				date: new Date(h.created).toLocaleDateString(),
				author: h.author?.displayName || "Unknown",
			}
		})
}

export function extractAssigneeChanges(
	changelog: ChangelogEntry[],
	limit: number = 2
): AssigneeChange[] {
	return changelog
		.filter((h) => h.items?.some((i) => i.field === "assignee"))
		.slice(-limit)
		.map((h) => {
			const assigneeItem = h.items?.find((i) => i.field === "assignee")
			return {
				from: assigneeItem?.fromString || "Unassigned",
				to: assigneeItem?.toString || "Unassigned",
				date: new Date(h.created).toLocaleDateString(),
			}
		})
}

interface JiraConfig {
	baseUrl: string
	email: string
	apiToken: string
}

function isJiraConfigValid(config: JiraConfig): boolean {
	return !!(config.baseUrl && config.email && config.apiToken)
}

function buildAuthHeader(config: JiraConfig): string {
	const credentials = `${config.email}:${config.apiToken}`
	return Buffer.from(credentials).toString("base64")
}

function buildHistoryUrl(baseUrl: string, ticketKey: string): string {
	return `${baseUrl}/rest/api/3/issue/${ticketKey}?expand=changelog,comment`
}

interface JiraHistoryResponse {
	fields?: {
		comment?: { comments?: JiraRawComment[] }
		description?: AdfNode | string
	}
	changelog?: { histories?: ChangelogEntry[] }
}

function parseHistoryResponse(
	data: JiraHistoryResponse,
	ticketKey: string
): TicketHistory {
	const rawComments = data.fields?.comment?.comments || []
	const changelog = data.changelog?.histories || []

	logger.debug(`Fetched history for ${ticketKey}`, {
		comments: rawComments.length,
		changelogEntries: changelog.length,
	})

	return {
		comments: processComments(rawComments).reverse(),
		statusChanges: extractStatusChanges(changelog),
		assigneeChanges: extractAssigneeChanges(changelog),
		description: extractDescription(data.fields?.description),
	}
}

export async function fetchTicketHistory(
	ticketKey: string
): Promise<TicketHistory | null> {
	const jiraConfig = getJiraConfig()

	if (!isJiraConfigValid(jiraConfig)) {
		logger.warn("Jira credentials not configured")
		return null
	}

	try {
		const authHeader = buildAuthHeader(jiraConfig)
		const url = buildHistoryUrl(jiraConfig.baseUrl, ticketKey)

		const response = await fetch(url, {
			headers: {
				Authorization: `Basic ${authHeader}`,
				Accept: "application/json",
			},
		})

		if (!response.ok) {
			logger.error("Failed to fetch ticket history", {
				ticketKey,
				status: response.status,
				statusText: response.statusText,
			})
			return null
		}

		const data = (await response.json()) as JiraHistoryResponse
		return parseHistoryResponse(data, ticketKey)
	} catch (error) {
		logger.error("Error fetching ticket history", {
			ticketKey,
			error: error instanceof Error ? error.message : String(error),
		})
		return null
	}
}
