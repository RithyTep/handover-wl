import { getSlackConfig } from "@/lib/env"
import { logger } from "@/lib/logger"
import { TIMEOUTS, TIMEZONE } from "@/lib/config"
import type { SlackBlock, SlackResponse } from "@/lib/types"

const log = logger.slack

const SLACK_API = "https://slack.com/api"

function getConfig() {
	return getSlackConfig()
}

async function callApi(
	endpoint: string,
	body: Record<string, unknown>,
	token?: string
): Promise<SlackResponse> {
	const config = getConfig()
	const authToken = token || config.botToken

	if (!authToken) {
		log.warn("No Slack token available for API call", { endpoint })
		return { ok: false, error: "No authentication token configured" }
	}

	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.SLACK)

	try {
		const response = await fetch(`${SLACK_API}/${endpoint}`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${authToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
			signal: controller.signal,
		})
		clearTimeout(timeoutId)

		const data: SlackResponse = await response.json()

		if (!data.ok) {
			log.warn("Slack API returned error", { endpoint, error: data.error })
		}

		return data
	} catch (error: unknown) {
		clearTimeout(timeoutId)
		const err = error as { name?: string; message?: string }
		const errorMessage =
			err.name === "AbortError"
				? "Request timeout"
				: err.message || "Unknown error"

		log.error("Slack API call failed", { endpoint, error: errorMessage })

		return {
			ok: false,
			error: errorMessage,
		}
	}
}

export async function postMessage(
	text: string,
	channel?: string,
	blocks?: SlackBlock[],
	token?: string
): Promise<SlackResponse> {
	const config = getConfig()
	const targetChannel = channel || config.channelId

	if (!targetChannel) {
		log.error("No channel specified for message")
		return { ok: false, error: "No channel specified" }
	}

	log.info("Posting message to Slack", { channel: targetChannel })

	return callApi(
		"chat.postMessage",
		{ channel: targetChannel, text, ...(blocks && { blocks }) },
		token
	)
}

export async function postThreadReply(
	text: string,
	threadTs: string,
	channel?: string,
	token?: string
): Promise<SlackResponse> {
	const config = getConfig()
	const targetChannel = channel || config.channelId

	if (!targetChannel) {
		log.error("No channel specified for thread reply")
		return { ok: false, error: "No channel specified" }
	}

	log.info("Posting thread reply to Slack", {
		channel: targetChannel,
		threadTs,
	})

	return callApi(
		"chat.postMessage",
		{ channel: targetChannel, text, thread_ts: threadTs },
		token
	)
}

export async function updateMessage(
	text: string,
	ts: string,
	channel?: string,
	blocks?: SlackBlock[]
): Promise<SlackResponse> {
	const config = getConfig()
	const targetChannel = channel || config.channelId

	if (!targetChannel) {
		log.error("No channel specified for message update")
		return { ok: false, error: "No channel specified" }
	}

	log.info("Updating Slack message", { channel: targetChannel, ts })

	return callApi("chat.update", {
		channel: targetChannel,
		ts,
		text,
		...(blocks && { blocks }),
	})
}

export async function getHistory(
	channel?: string,
	limit: number = 100
): Promise<SlackResponse> {
	const config = getConfig()
	const targetChannel = channel || config.channelId

	if (!targetChannel) {
		log.error("No channel specified for history")
		return { ok: false, error: "No channel specified" }
	}

	return callApi("conversations.history", { channel: targetChannel, limit })
}

export async function getThreadReplies(
	threadTs: string,
	channel?: string
): Promise<SlackResponse> {
	const config = getConfig()
	const targetChannel = channel || config.channelId

	if (!targetChannel) {
		log.error("No channel specified for thread replies")
		return { ok: false, error: "No channel specified" }
	}

	return callApi("conversations.replies", {
		channel: targetChannel,
		ts: threadTs,
	})
}

export function formatDate(date: Date = new Date()): string {
	return date.toLocaleDateString("en-GB", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: TIMEZONE.NAME,
	})
}

export function formatTime(date: Date = new Date()): string {
	return date.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
		timeZone: TIMEZONE.NAME,
	})
}

export async function testAuth(): Promise<SlackResponse & { user?: string; user_id?: string; team?: string }> {
	const config = getConfig()

	if (!config.botToken) {
		return { ok: false, error: "No bot token configured" }
	}

	try {
		const response = await fetch(`${SLACK_API}/auth.test`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${config.botToken}`,
				"Content-Type": "application/json",
			},
		})
		return response.json()
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error"
		return { ok: false, error: message }
	}
}

export async function checkHealth(): Promise<{
	healthy: boolean
	latency: number
	error?: string
}> {
	const config = getConfig()
	const start = Date.now()

	if (!config.botToken) {
		return {
			healthy: false,
			latency: Date.now() - start,
			error: "No bot token configured",
		}
	}

	try {
		const response = await fetch(`${SLACK_API}/auth.test`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${config.botToken}`,
				"Content-Type": "application/json",
			},
		})

		const data: SlackResponse = await response.json()

		return {
			healthy: data.ok === true,
			latency: Date.now() - start,
			error: data.ok ? undefined : data.error,
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
