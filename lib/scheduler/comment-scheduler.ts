import axios from "axios"
import { getEnabledScheduledComments } from "@/lib/services"
import { getAppConfig } from "@/lib/env"
import { logger } from "@/lib/logger"
import { TIMEOUTS } from "@/lib/config"
import { shouldRunCronNow } from "./cron-utils"

const log = logger.scheduler

export async function checkAndPostScheduledComments(): Promise<void> {
	const config = getAppConfig()

	try {
		const scheduledComments = await getEnabledScheduledComments()
		const jiraComments = scheduledComments.filter((c) => c.comment_type === "jira")

		if (jiraComments.length === 0) return

		const now = new Date()

		for (const comment of jiraComments) {
			try {
				const shouldRun = shouldRunCronNow(
					comment.cron_schedule,
					comment.last_posted_at,
					now
				)

				if (shouldRun) {
					log.info("Posting scheduled comment", {
						commentId: comment.id,
						ticketKey: comment.ticket_key,
					})

					await axios.post(
						`${config.url}/api/post-jira-comment`,
						{
							ticket_key: comment.ticket_key,
							comment_text: comment.comment_text,
							scheduled_comment_id: comment.id,
						},
						{ headers: { "Content-Type": "application/json" }, timeout: TIMEOUTS.JIRA }
					)

					log.info("Scheduled comment posted", { commentId: comment.id })
				}
			} catch (error: unknown) {
				const errMsg = error instanceof Error ? error.message : "Unknown error"
				log.error("Failed to post comment", {
					commentId: comment.id,
					error: errMsg,
				})
			}
		}
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Comment check failed", { error: message })
	}
}
