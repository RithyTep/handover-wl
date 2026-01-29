import axios from "axios"
import { getJiraConfig } from "@/lib/env"
import { logger } from "@/lib/logger"
import { JQL_QUERY, JIRA_FIELDS, JIRA, TIMEOUTS } from "@/lib/config"
import type { Ticket, JiraIssue, JiraComment, TicketData } from "@/lib/types"

const log = logger.jira

function getConfig() {
	return getJiraConfig()
}

function getAuthHeader(): string {
	const { email, apiToken } = getConfig()
	return Buffer.from(`${email}:${apiToken}`).toString("base64")
}

function createHeaders() {
	return {
		Authorization: `Basic ${getAuthHeader()}`,
		Accept: "application/json",
		"Content-Type": "application/json",
	}
}

export async function fetchTickets(
	jql: string = JQL_QUERY,
	maxResults: number = JIRA.MAX_RESULTS
): Promise<JiraIssue[]> {
	const { baseUrl } = getConfig()
	const timer = log.time("Fetch tickets from Jira")

	try {
		const response = await axios.post(
			`${baseUrl}/rest/api/3/search/jql`,
			{ jql, maxResults, fields: JIRA_FIELDS },
			{ headers: createHeaders(), timeout: TIMEOUTS.JIRA }
		)

		timer.end("Tickets fetched", { count: response.data.issues?.length || 0 })
		return response.data.issues
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Failed to fetch tickets from Jira", { error: message })
		throw error
	}
}

type CustomField = { value?: string } | undefined

function extractCustomFieldValue(
	fields: JiraIssue["fields"],
	fieldKey: string
): string {
	const field = fields[fieldKey] as CustomField
	return field?.value || "None"
}

function extractAssigneeInfo(assignee: JiraIssue["fields"]["assignee"]): {
	name: string
	avatar: string | null
} {
	return {
		name: assignee?.displayName || "Unassigned",
		avatar: assignee?.avatarUrls?.["48x48"] || null,
	}
}

function extractSavedData(savedData?: TicketData): {
	status: string
	action: string
} {
	return {
		status: savedData?.status || "--",
		action: savedData?.action || "--",
	}
}

export function transformIssue(
	issue: JiraIssue,
	savedData?: TicketData
): Ticket {
	const { baseUrl } = getConfig()
	const { fields, key } = issue
	const assignee = extractAssigneeInfo(fields.assignee)
	const saved = extractSavedData(savedData)

	return {
		key,
		summary: fields.summary,
		status: fields.status.name,
		assignee: assignee.name,
		assigneeAvatar: assignee.avatar,
		created: fields.created,
		dueDate: fields.duedate || null,
		issueType: fields.issuetype?.name || "None",
		wlMainTicketType: extractCustomFieldValue(fields, JIRA.FIELDS.WL_MAIN_TICKET_TYPE),
		wlSubTicketType: extractCustomFieldValue(fields, JIRA.FIELDS.WL_SUB_TICKET_TYPE),
		customerLevel: (fields[JIRA.FIELDS.CUSTOMER_LEVEL] as string) || "None",
		jiraUrl: `${baseUrl}/browse/${key}`,
		savedStatus: saved.status,
		savedAction: saved.action,
	}
}

export async function getTicketsWithSavedData(
	savedData: Record<string, TicketData>
): Promise<Ticket[]> {
	const issues = await fetchTickets()
	return issues.map((issue) => transformIssue(issue, savedData[issue.key]))
}

export async function postComment(
	issueKey: string,
	comment: string
): Promise<boolean> {
	const { baseUrl } = getConfig()
	log.info("Posting comment to Jira", { issueKey })

	try {
		await axios.post(
			`${baseUrl}/rest/api/3/issue/${issueKey}/comment`,
			{
				body: {
					type: "doc",
					version: 1,
					content: [
						{
							type: "paragraph",
							content: [{ type: "text", text: comment }],
						},
					],
				},
			},
			{ headers: createHeaders(), timeout: TIMEOUTS.JIRA }
		)

		log.info("Comment posted successfully", { issueKey })
		return true
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Failed to post comment to Jira", { issueKey, error: message })
		return false
	}
}

function extractTextFromBody(body: JiraComment["body"]): string {
	if (!body?.content) return ""
	const parts: string[] = []
	for (const block of body.content) {
		if (block.type === "mediaSingle" || block.type === "mediaGroup") {
			parts.push("[Image]")
		} else if (block.content) {
			const text = block.content
				.map((item) => {
					if (item.type === "media" || item.type === "mediaInline") return "[Image]"
					return item.text || ""
				})
				.filter(Boolean)
				.join("")
			if (text) parts.push(text)
		}
	}
	return parts.join("\n")
}

interface JiraAttachment {
	id: string
	filename: string
	created: string
	mimeType: string
	content: string
	thumbnail?: string
	size: number
	author: { displayName: string }
}

export interface TicketAttachmentInfo {
	id: string
	filename: string
	mimeType: string
	created: string
	size: number
	author: string
	thumbnailUrl: string
	contentUrl: string
}

export async function fetchIssueAttachments(
	issueKey: string
): Promise<TicketAttachmentInfo[]> {
	const { baseUrl } = getConfig()

	try {
		const response = await axios.get(
			`${baseUrl}/rest/api/3/issue/${issueKey}?fields=attachment`,
			{ headers: createHeaders(), timeout: TIMEOUTS.JIRA }
		)

		const attachments: JiraAttachment[] =
			response.data.fields?.attachment || []

		return attachments
			.filter((a) => a.mimeType.startsWith("image/"))
			.map((a) => ({
				id: a.id,
				filename: a.filename,
				mimeType: a.mimeType,
				created: a.created,
				size: a.size,
				author: a.author.displayName,
				thumbnailUrl: `/api/jira-image?id=${a.id}&type=thumbnail`,
				contentUrl: `/api/jira-image?id=${a.id}&type=content`,
			}))
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Failed to fetch attachments", { issueKey, error: message })
		return []
	}
}

export async function fetchAttachmentContent(
	attachmentId: string,
	type: "content" | "thumbnail"
): Promise<{ data: Buffer; contentType: string } | null> {
	const { baseUrl } = getConfig()

	try {
		const url =
			type === "thumbnail"
				? `${baseUrl}/rest/api/3/attachment/thumbnail/${attachmentId}`
				: `${baseUrl}/rest/api/3/attachment/content/${attachmentId}`

		const response = await axios.get(url, {
			headers: {
				Authorization: `Basic ${getAuthHeader()}`,
				Accept: "*/*",
			},
			responseType: "arraybuffer",
			timeout: TIMEOUTS.JIRA,
		})

		return {
			data: Buffer.from(response.data),
			contentType: response.headers["content-type"] || "image/png",
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Failed to fetch attachment content", {
			attachmentId,
			error: message,
		})
		return null
	}
}

export async function fetchTicketComments(
	issueKey: string
): Promise<Array<{ author: string; text: string; created: string }>> {
	const { baseUrl } = getConfig()

	try {
		const response = await axios.get(
			`${baseUrl}/rest/api/3/issue/${issueKey}/comment`,
			{ headers: createHeaders(), timeout: TIMEOUTS.JIRA }
		)

		const comments: JiraComment[] = response.data.comments || []

		return comments.map((comment) => ({
			author: comment.author.displayName,
			text: extractTextFromBody(comment.body),
			created: comment.created,
		}))
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Failed to fetch comments", { issueKey, error: message })
		return []
	}
}

export function getLatestWLTCComment(
	comments: Array<{ author: string; text: string; created: string }>
): { author: string; text: string } | null {
	const wlTcComments = comments.filter((c) => {
		const authorLower = c.author.toLowerCase()
		return (
			authorLower.includes("_wl_") ||
			authorLower.includes("wl_tc") ||
			authorLower.includes("wl_am") ||
			authorLower.includes("wl_po")
		)
	})

	if (wlTcComments.length === 0) return null

	const latest = wlTcComments[wlTcComments.length - 1]
	return { author: latest.author, text: latest.text }
}

export async function fetchTransitions(
	issueKey: string
): Promise<Array<{ id: string; name: string; statusName: string }>> {
	const { baseUrl } = getConfig()

	try {
		const response = await axios.get(
			`${baseUrl}/rest/api/3/issue/${issueKey}/transitions`,
			{ headers: createHeaders(), timeout: TIMEOUTS.JIRA }
		)

		const transitions = response.data.transitions || []
		return transitions.map(
			(t: { id: string; name: string; to?: { name?: string } }) => ({
				id: t.id,
				name: t.name,
				statusName: t.to?.name || t.name,
			})
		)
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Failed to fetch transitions", { issueKey, error: message })
		return []
	}
}

export async function transitionIssue(
	issueKey: string,
	transitionId: string
): Promise<boolean> {
	const { baseUrl } = getConfig()
	log.info("Transitioning issue", { issueKey, transitionId })

	try {
		await axios.post(
			`${baseUrl}/rest/api/3/issue/${issueKey}/transitions`,
			{ transition: { id: transitionId } },
			{ headers: createHeaders(), timeout: TIMEOUTS.JIRA }
		)

		log.info("Issue transitioned successfully", { issueKey, transitionId })
		return true
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Failed to transition issue", { issueKey, error: message })
		return false
	}
}

export async function uploadAttachment(
	issueKey: string,
	fileBuffer: Buffer,
	filename: string,
	mimeType: string
): Promise<{ id: string; filename: string; mimeType: string } | null> {
	const { baseUrl } = getConfig()
	log.info("Uploading attachment to Jira", { issueKey, filename })

	try {
		const FormData = (await import("form-data")).default
		const form = new FormData()
		form.append("file", fileBuffer, { filename, contentType: mimeType })

		const response = await axios.post(
			`${baseUrl}/rest/api/3/issue/${issueKey}/attachments`,
			form,
			{
				headers: {
					...form.getHeaders(),
					Authorization: `Basic ${getAuthHeader()}`,
					"X-Atlassian-Token": "no-check",
				},
				timeout: TIMEOUTS.JIRA,
			}
		)

		const attachment = response.data?.[0]
		if (!attachment) return null

		log.info("Attachment uploaded", { issueKey, filename: attachment.filename })
		return {
			id: attachment.id,
			filename: attachment.filename,
			mimeType: attachment.mimeType,
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Failed to upload attachment", { issueKey, error: message })
		return null
	}
}

export async function checkHealth(): Promise<{
	healthy: boolean
	latency: number
	error?: string
}> {
	const { baseUrl } = getConfig()
	const start = Date.now()

	try {
		await axios.get(`${baseUrl}/rest/api/3/myself`, {
			headers: createHeaders(),
			timeout: 5000,
		})

		return {
			healthy: true,
			latency: Date.now() - start,
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error"
		return {
			healthy: false,
			latency: Date.now() - start,
			error: message,
		}
	}
}
