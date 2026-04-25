import { NextRequest, NextResponse, after } from "next/server"
import { logger } from "@/lib/logger"
import { verifySlackRequest, parseSlackCommand } from "@/lib/security/slack-verify"
import { handleSlashCommand } from "@/lib/services/slack-commands"

const log = logger.api

export async function POST(request: NextRequest) {
	try {
		const { valid, body, error } = await verifySlackRequest(request.clone())
		if (!valid) {
			log.warn("Invalid Slack request", { error })
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const payload = parseSlackCommand(body)
		log.info("Slash command received", {
			command: payload.command,
			text: payload.text,
			user: payload.userName,
		})

		const responseUrl = payload.responseUrl

		// Run the handler after the response is sent so Slack's 3s ack window is met.
		after(async () => {
			try {
				const result = await handleSlashCommand(payload)
				if (responseUrl) {
					await postToResponseUrl(responseUrl, result)
				}
			} catch (err) {
				const message = err instanceof Error ? err.message : "Unknown error"
				log.error("Async slash command handler failed", { error: message })
				if (responseUrl) {
					await postToResponseUrl(responseUrl, {
						response_type: "ephemeral",
						text: `Something went wrong: ${message}`,
					}).catch(() => {})
				}
			}
		})

		// Immediate ack to Slack within 3s.
		return NextResponse.json({
			response_type: "ephemeral",
			text: "Working on it…",
		})
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Slash command error", { error: message })
		return NextResponse.json({
			response_type: "ephemeral",
			text: "Something went wrong. Please try again.",
		})
	}
}

async function postToResponseUrl(url: string, body: unknown): Promise<void> {
	await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	})
}
