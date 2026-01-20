import crypto from "crypto"
import { createLogger } from "@/lib/logger"

const logger = createLogger("SlackVerify")

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET

/**
 * Verifies that a request came from Slack using their signing secret.
 * @see https://api.slack.com/authentication/verifying-requests-from-slack
 */
export async function verifySlackRequest(
	request: Request
): Promise<{ valid: boolean; body: string; error?: string }> {
	if (!SLACK_SIGNING_SECRET) {
		logger.error("SLACK_SIGNING_SECRET not configured")
		return { valid: false, body: "", error: "Slack signing secret not configured" }
	}

	const timestamp = request.headers.get("x-slack-request-timestamp")
	const signature = request.headers.get("x-slack-signature")

	if (!timestamp || !signature) {
		logger.warn("Missing Slack headers", { hasTimestamp: !!timestamp, hasSignature: !!signature })
		return { valid: false, body: "", error: "Missing required Slack headers" }
	}

	// Prevent replay attacks - reject requests older than 5 minutes
	const requestTime = parseInt(timestamp, 10)
	const currentTime = Math.floor(Date.now() / 1000)
	if (Math.abs(currentTime - requestTime) > 300) {
		logger.warn("Slack request too old", { timestamp, currentTime })
		return { valid: false, body: "", error: "Request timestamp too old" }
	}

	const body = await request.text()
	const sigBaseString = `v0:${timestamp}:${body}`
	const hmac = crypto.createHmac("sha256", SLACK_SIGNING_SECRET)
	hmac.update(sigBaseString)
	const computedSignature = `v0=${hmac.digest("hex")}`

	const isValid = crypto.timingSafeEqual(
		Buffer.from(signature),
		Buffer.from(computedSignature)
	)

	if (!isValid) {
		logger.warn("Invalid Slack signature")
		return { valid: false, body: "", error: "Invalid request signature" }
	}

	logger.debug("Slack request verified successfully")
	return { valid: true, body }
}

/**
 * Parses the body of a Slack slash command request.
 */
export function parseSlackCommand(body: string): SlackCommandPayload {
	const params = new URLSearchParams(body)
	return {
		token: params.get("token") || "",
		teamId: params.get("team_id") || "",
		teamDomain: params.get("team_domain") || "",
		channelId: params.get("channel_id") || "",
		channelName: params.get("channel_name") || "",
		userId: params.get("user_id") || "",
		userName: params.get("user_name") || "",
		command: params.get("command") || "",
		text: params.get("text") || "",
		responseUrl: params.get("response_url") || "",
		triggerId: params.get("trigger_id") || "",
	}
}

export interface SlackCommandPayload {
	token: string
	teamId: string
	teamDomain: string
	channelId: string
	channelName: string
	userId: string
	userName: string
	command: string
	text: string
	responseUrl: string
	triggerId: string
}
