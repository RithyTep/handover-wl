import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { rateLimit, getClientIP, getRateLimitHeaders } from "@/lib/security/rate-limit"
import { TicketService } from "@/server/services/ticket.service"

const log = logger.api
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN
const SLACK_CHANNEL = process.env.SLACK_CHANNEL
const JIRA_URL = process.env.JIRA_URL
const ticketService = new TicketService()

const SLACK_RATE_LIMIT = 10
const SLACK_RATE_WINDOW_MS = 60000

export async function POST(request: NextRequest) {
	const ip = getClientIP(request)
	const rateLimitResult = rateLimit(ip, SLACK_RATE_LIMIT, SLACK_RATE_WINDOW_MS)

	if (!rateLimitResult.success) {
		return NextResponse.json(
			{ success: false, error: "Rate limit exceeded. Please try again later." },
			{
				status: 429,
				headers: getRateLimitHeaders(rateLimitResult, SLACK_RATE_LIMIT),
			}
		)
	}

	try {
		const body = await request.json()
		const { ticketData, ticketDetails } = body

		// Save to database instead of file system
		const formattedData: Record<string, { status: string; action: string }> = {}
		for (const [key, value] of Object.entries(ticketData)) {
			const isStatus = key.startsWith("status-")
			const isAction = key.startsWith("action-")
			if (!isStatus && !isAction) continue
			const ticketKey = key.replace(/^(status|action)-/, "")
			if (!formattedData[ticketKey]) {
				formattedData[ticketKey] = { status: "--", action: "--" }
			}
			if (isStatus) formattedData[ticketKey].status = value as string
			if (isAction) formattedData[ticketKey].action = value as string
		}
		await ticketService.saveTicketData(formattedData)

		if (!SLACK_BOT_TOKEN || !SLACK_CHANNEL) {
			return NextResponse.json(
				{ success: false, error: "Missing SLACK_BOT_TOKEN or SLACK_CHANNEL" },
				{ status: 400 }
			)
		}

		const ticketKeys = Object.keys(ticketData)
			.filter((key) => key.startsWith("status-"))
			.map((key) => key.replace("status-", ""))

		let message = "Please refer to this ticket information\n\n"

		ticketKeys.forEach((ticketKey, index) => {
			const status = ticketData[`status-${ticketKey}`] || "--"
			const action = ticketData[`action-${ticketKey}`] || "--"
			const details = ticketDetails?.[ticketKey] || {}
			const summary = details.summary || ""
			const wlMainType = details.wlMainTicketType || "--"
			const wlSubType = details.wlSubTicketType || "--"
			const ticketUrl = `${JIRA_URL}/browse/${ticketKey}`

			message += `--- Ticket ${index + 1} ---\n`
			message += `Ticket Link: <${ticketUrl}|${ticketKey}> ${summary}\n`
			message += `WL Main Type: ${wlMainType}\n`
			message += `WL Sub Type: ${wlSubType}\n`
			message += `Status: ${status}\n`
			message += `Action: ${action}\n`
			message += `\n`
		})
		message += `===========================\n`

		const postResponse = await fetch("https://slack.com/api/chat.postMessage", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${SLACK_BOT_TOKEN}`,
			},
			body: JSON.stringify({
				channel: SLACK_CHANNEL,
				text: message.trim(),
				unfurl_links: false,
				unfurl_media: false,
			}),
		})

		const postResult = await postResponse.json()

		if (!postResult.ok) {
			return NextResponse.json(
				{ success: false, error: postResult.error },
				{ status: 400 }
			)
		}

		return NextResponse.json({
			success: true,
			message_ts: postResult.ts
		})
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Send Slack error", { error: message })
		return NextResponse.json(
			{ success: false, error: message },
			{ status: 500 }
		)
	}
}
