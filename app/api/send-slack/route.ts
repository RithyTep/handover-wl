import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { postMessage } from "@/lib/services/slack"
import { getSlackConfig } from "@/lib/env"
import { apiSuccess, badRequest, handleApiError } from "@/lib/api"
import { rateLimit, getClientIP, getRateLimitHeaders } from "@/lib/security/rate-limit"

const JIRA_URL = process.env.JIRA_URL
const STORAGE_FILE = path.join(process.cwd(), "ticket_data.json")
const SLACK_RATE_LIMIT = 10
const SLACK_RATE_WINDOW_MS = 60000

function formatSlackMessage(
	ticketData: Record<string, string>,
	ticketDetails: Record<string, { summary?: string; wlMainTicketType?: string; wlSubTicketType?: string }>
): string {
	const ticketKeys = Object.keys(ticketData)
		.filter((key) => key.startsWith("status-"))
		.map((key) => key.replace("status-", ""))

	let message = "Please refer to this ticket information\n\n"
	ticketKeys.forEach((ticketKey, index) => {
		const status = ticketData[`status-${ticketKey}`] || "--"
		const action = ticketData[`action-${ticketKey}`] || "--"
		const details = ticketDetails?.[ticketKey] || {}
		const ticketUrl = `${JIRA_URL}/browse/${ticketKey}`

		message += `--- Ticket ${index + 1} ---\n`
		message += `Ticket Link: <${ticketUrl}|${ticketKey}> ${details.summary || ""}\n`
		message += `WL Main Type: ${details.wlMainTicketType || "--"}\n`
		message += `WL Sub Type: ${details.wlSubTicketType || "--"}\n`
		message += `Status: ${status}\nAction: ${action}\n\n`
	})
	return message + "===========================\n"
}

export async function POST(request: NextRequest) {
	const ip = getClientIP(request)
	const rateLimitResult = rateLimit(ip, SLACK_RATE_LIMIT, SLACK_RATE_WINDOW_MS)

	if (!rateLimitResult.success) {
		return NextResponse.json(
			{ success: false, error: "Rate limit exceeded. Please try again later." },
			{ status: 429, headers: getRateLimitHeaders(rateLimitResult, SLACK_RATE_LIMIT) }
		)
	}

	try {
		const config = getSlackConfig()
		if (!config.botToken || !config.channelId) {
			return badRequest("Missing SLACK_BOT_TOKEN or SLACK_CHANNEL")
		}

		const body = await request.json()
		const { ticketData, ticketDetails } = body

		fs.writeFileSync(STORAGE_FILE, JSON.stringify(ticketData, null, 2))

		const message = formatSlackMessage(ticketData, ticketDetails)
		const result = await postMessage(message.trim(), config.channelId)

		if (!result.ok) {
			return badRequest(result.error || "Failed to post message")
		}

		return apiSuccess({ message_ts: result.ts })
	} catch (error) {
		return handleApiError(error, "POST /api/send-slack")
	}
}
