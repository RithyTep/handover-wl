import { NextRequest } from "next/server"
import { postMessage, getHistory, testAuth } from "@/lib/services/slack"
import { getSlackConfig } from "@/lib/env"
import { apiSuccess, badRequest, handleApiError } from "@/lib/api"

export async function POST(request: NextRequest) {
	try {
		const config = getSlackConfig()
		if (!config.botToken || !config.channelId) {
			return badRequest("Missing SLACK_BOT_TOKEN or SLACK_CHANNEL")
		}

		const { message, thread_ts } = await request.json()
		const result = await postMessage(message, config.channelId)

		if (!result.ok) return badRequest(result.error || "Failed to post")

		return apiSuccess({
			ts: result.ts,
			channel: result.channel,
			message: thread_ts ? "Thread reply posted" : "Message posted",
		})
	} catch (error) {
		return handleApiError(error, "POST /api/slack-thread")
	}
}

export async function GET() {
	try {
		const config = getSlackConfig()
		if (!config.botToken || !config.channelId) {
			return badRequest("Missing SLACK_BOT_TOKEN or SLACK_CHANNEL")
		}

		const authResult = await testAuth()
		if (!authResult.ok) {
			return badRequest(`Token invalid: ${authResult.error}`)
		}

		const result = await getHistory(config.channelId, 10)
		if (!result.ok) {
			const errorMsg = result.error === "channel_not_found"
				? `Bot needs to be invited: /invite @${authResult.user}`
				: result.error || "Failed to get history"
			return badRequest(errorMsg)
		}

		const messages = (result.messages || []).map((msg: { ts: string; text?: string; user?: string }) => ({
			ts: msg.ts,
			text: msg.text?.substring(0, 100) + (msg.text && msg.text.length > 100 ? "..." : ""),
			user: msg.user,
		}))

		return apiSuccess({ messages })
	} catch (error) {
		return handleApiError(error, "GET /api/slack-thread")
	}
}
