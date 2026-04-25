import { NextRequest } from "next/server"
import { apiSuccess, handleApiError, unauthorized } from "@/lib/api"
import {
	getSchedulerEnabled,
	getTriggerTimes,
	createBackup,
	cleanupOldBackups,
	loadTicketData,
	saveTicketData,
	getCustomChannelId,
	getEveningUserToken,
	getNightUserToken,
	getEveningMentions,
	getNightMentions,
	getTicketsWithSavedData,
} from "@/lib/services"
import {
	AIAutofillService,
	HandoverService,
	SlackMessagingService,
} from "@/server/services"
import { logger } from "@/lib/logger"
import { getSlackConfig } from "@/lib/env"
import { BACKUP, TIMEZONE } from "@/lib/config"

const log = logger.scheduler

/**
 * Vercel Cron endpoint for scheduled tasks
 *
 * Query params:
 * - task: "shift" | "backup" | "handover" | "ai-autofill"
 *
 * For "shift" task:
 * - Runs every minute via Vercel cron
 * - Fetches configured trigger times from database
 * - Executes shift if current time matches configured time
 * - Times are configurable via the Scheduler UI (no redeploy needed)
 */
export async function GET(request: NextRequest) {
	try {
		// Verify cron secret for security
		const authHeader = request.headers.get("authorization")
		const cronSecret = process.env.CRON_SECRET

		if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
			log.warn("Unauthorized cron request")
			return unauthorized("Invalid cron secret")
		}

		const task = request.nextUrl.searchParams.get("task")

		if (!task) {
			return handleApiError(
				new Error("Task parameter required: shift, backup, handover, or ai-autofill"),
				"GET /api/cron"
			)
		}

		// Check if scheduler is enabled (except for backup which always runs)
		if (task !== "backup") {
			const isEnabled = await getSchedulerEnabled()
			if (!isEnabled) {
				return apiSuccess({ skipped: true, reason: "scheduler_disabled" })
			}
		}

		switch (task) {
			case "shift":
				return await runShiftCheckTask()

			case "backup":
				return await runBackupTask()

			case "handover":
				return await runHandoverReplyTask()

			case "ai-autofill": {
				const slotParam = request.nextUrl.searchParams.get("slot")
				const slot = slotParam === "night" ? "night" : "evening"
				return await runAIAutofillTask(slot)
			}

			default:
				return handleApiError(
					new Error(`Unknown task: ${task}`),
					"GET /api/cron"
				)
		}
	} catch (error) {
		return handleApiError(error, "GET /api/cron")
	}
}

/**
 * Check if current time matches any configured shift time
 * Times are fetched from database - configurable via UI
 */
async function runShiftCheckTask() {
	const { time1, time2 } = await getTriggerTimes()
	const now = getCurrentTimeInTimezone()

	const currentTime = `${String(now.hour).padStart(2, "0")}:${String(now.minute).padStart(2, "0")}`

	log.debug("Checking shift times", { currentTime, evening: time1, night: time2 })

	// Check evening shift (time1)
	if (currentTime === time1) {
		log.info("Evening shift time matched", { time: time1 })
		return await runShiftTask("evening")
	}

	// Check night shift (time2)
	if (currentTime === time2) {
		log.info("Night shift time matched", { time: time2 })
		return await runShiftTask("night")
	}

	// No match - skip silently
	return apiSuccess({ skipped: true, reason: "no_time_match", currentTime })
}

/**
 * Get current time in configured timezone
 */
function getCurrentTimeInTimezone(): { hour: number; minute: number } {
	const now = new Date()
	const formatter = new Intl.DateTimeFormat("en-US", {
		timeZone: TIMEZONE.NAME,
		hour: "numeric",
		minute: "numeric",
		hour12: false,
	})

	const parts = formatter.formatToParts(now)
	const hour = parseInt(parts.find((p) => p.type === "hour")?.value || "0")
	const minute = parseInt(parts.find((p) => p.type === "minute")?.value || "0")

	return { hour, minute }
}

async function runShiftTask(shift: "evening" | "night") {
	log.info("Running shift task via Vercel cron", { shift })

	const userToken =
		shift === "evening" ? await getEveningUserToken() : await getNightUserToken()

	if (!userToken) {
		log.info("Skipping shift - no token configured", { shift })
		return apiSuccess({ skipped: true, reason: "no_token", shift })
	}

	const mentions =
		shift === "evening" ? await getEveningMentions() : await getNightMentions()

	const customChannelId = await getCustomChannelId()
	const savedData = await loadTicketData()
	const tickets = await getTicketsWithSavedData(savedData)

	const slackMessaging = new SlackMessagingService()
	const ticketData = slackMessaging.convertTicketsToMessageData(tickets)

	const result = await slackMessaging.postShiftHandover(
		ticketData,
		shift,
		userToken,
		customChannelId || undefined,
		mentions || undefined
	)

	if (!result.success) {
		throw new Error(result.error || "Failed to post shift message")
	}

	// Also run handover reply after posting
	const handoverService = new HandoverService()
	await handoverService.scanAndReplyToHandover()

	log.info("Shift task completed", { shift, ticketCount: tickets.length })

	return apiSuccess({
		success: true,
		shift,
		ticketsProcessed: tickets.length,
		messageTs: result.messageTs,
	})
}

async function runBackupTask() {
	log.info("Running backup task via Vercel cron")

	const backup = await createBackup("auto", "Vercel cron backup")

	if (!backup) {
		throw new Error("Failed to create backup")
	}

	await cleanupOldBackups(BACKUP.MAX_COUNT)

	log.info("Backup task completed", { backupId: backup.id })

	return apiSuccess({
		success: true,
		backupId: backup.id,
		createdAt: backup.created_at,
	})
}

async function runHandoverReplyTask() {
	log.info("Running handover reply task via Vercel cron")

	const handoverService = new HandoverService()
	const result = await handoverService.scanAndReplyToHandover()

	log.info("Handover reply task completed", { replied: result.replied })

	return apiSuccess({
		success: true,
		replied: result.replied,
		message: result.message,
	})
}

function isMissingField(value: string | null | undefined): boolean {
	if (!value) return true
	const trimmed = value.trim()
	return trimmed === "" || trimmed === "--"
}

async function runAIAutofillTask(slot: "evening" | "night") {
	log.info("Running AI autofill task via Vercel cron", { slot })

	const savedData = await loadTicketData()
	const tickets = await getTicketsWithSavedData(savedData)

	const missing = tickets.filter(
		(t) => isMissingField(t.savedStatus) || isMissingField(t.savedAction)
	)

	const aiService = new AIAutofillService()
	const updates: Record<string, { status: string; action: string }> = {}
	const failures: Array<{ key: string; error: string }> = []

	if (missing.length === 0) {
		log.info("No tickets with missing status/action")
	} else {
		log.info("Found tickets needing autofill", { count: missing.length })

		for (const ticket of missing) {
			try {
				const { suggestion } = await aiService.generateSuggestion(ticket)
				updates[ticket.key] = {
					status: suggestion.status,
					action: suggestion.action,
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : "Unknown error"
				log.error("AI autofill failed for ticket", { key: ticket.key, error: message })
				failures.push({ key: ticket.key, error: message })
			}
		}

		if (Object.keys(updates).length > 0) {
			await saveTicketData(updates)
		}
	}

	const ticketsForSlack = tickets.map((t) => {
		const update = updates[t.key]
		return update
			? { ...t, savedStatus: update.status, savedAction: update.action }
			: t
	})

	const botToken = getSlackConfig().botToken

	if (!botToken) {
		log.warn("Skipping Slack post - SLACK_BOT_TOKEN not configured")
		return apiSuccess({
			success: true,
			slot,
			autofill: {
				total: missing.length,
				processed: Object.keys(updates).length,
				failed: failures.length,
				failures,
			},
			slackPosted: false,
			reason: "no_bot_token",
		})
	}

	const customChannelId = await getCustomChannelId()

	const slackMessaging = new SlackMessagingService()
	const ticketData = slackMessaging.convertTicketsToMessageData(ticketsForSlack)

	const result = await slackMessaging.postShiftHandover(
		ticketData,
		slot,
		botToken,
		customChannelId || undefined,
		undefined,
		"Scheduler"
	)

	if (!result.success) {
		throw new Error(result.error || "Failed to post Slack handover")
	}

	log.info("AI autofill + Slack post completed", {
		slot,
		autofilled: Object.keys(updates).length,
		ticketCount: ticketsForSlack.length,
	})

	return apiSuccess({
		success: true,
		slot,
		autofill: {
			total: missing.length,
			processed: Object.keys(updates).length,
			failed: failures.length,
			failures,
		},
		slackPosted: true,
		messageTs: result.messageTs,
	})
}
