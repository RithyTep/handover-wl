import axios from "axios"
import {
	getEnabledScheduledComments,
	getEveningUserToken,
	getNightUserToken,
} from "@/lib/services"
import { getAppConfig } from "@/lib/env"
import { logger } from "@/lib/logger"
import { TIMEOUTS } from "@/lib/config"

const log = logger.scheduler

export async function sendScheduledSlackMessage(
	timeLabel: string,
	shift: "evening" | "night"
): Promise<void> {
	const config = getAppConfig()

	try {
		const token =
			shift === "evening" ? await getEveningUserToken() : await getNightUserToken()

		if (!token) {
			log.info("Skipping shift - no token configured", { shift })
			return
		}

		log.info("Triggering shift", { shift, timeLabel })

		const response = await axios.post(
			`${config.url}/api/scheduled-slack`,
			{ shift },
			{ headers: { "Content-Type": "application/json" }, timeout: TIMEOUTS.SLACK }
		)

		log.info("Shift completed", { shift, success: response.data.success })

		await checkAndReplyToHandoverMessages()
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Shift failed", { shift, error: message })
	}
}

export async function checkAndReplyToHandoverMessages(): Promise<void> {
	const config = getAppConfig()

	try {
		const scheduledComments = await getEnabledScheduledComments()
		const slackComments = scheduledComments.filter((c) => c.comment_type === "slack")

		if (slackComments.length === 0) return

		const response = await axios.post(
			`${config.url}/api/scan-and-reply-handover`,
			{},
			{ headers: { "Content-Type": "application/json" }, timeout: TIMEOUTS.SLACK }
		)

		log.info("Handover scan completed", { replied: response.data.replied })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Handover check failed", { error: message })
	}
}
