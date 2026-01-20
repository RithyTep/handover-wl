import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { verifySlackRequest, parseSlackCommand } from "@/lib/security/slack-verify"
import { handleSlashCommand } from "@/lib/services/slack-commands"

const log = logger.api

export async function POST(request: NextRequest) {
	try {
		// Clone request for verification (body can only be read once)
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

		const response = await handleSlashCommand(payload)

		return NextResponse.json(response)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Slash command error", { error: message })

		return NextResponse.json({
			response_type: "ephemeral",
			text: "Something went wrong. Please try again.",
		})
	}
}
