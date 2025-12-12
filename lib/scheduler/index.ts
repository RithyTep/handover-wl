import * as cron from "node-cron"
import { getSchedulerEnabled, getTriggerTimes } from "@/lib/services"
import { getAppConfig } from "@/lib/env"
import { logger } from "@/lib/logger"
import { TIMEZONE } from "@/lib/config"
import { timeToCron } from "./cron-utils"
import { sendScheduledSlackMessage } from "./shift-scheduler"
import { checkAndPostScheduledComments } from "./comment-scheduler"
import { runHourlyBackup } from "./backup-scheduler"

const log = logger.scheduler

let scheduledTasks: cron.ScheduledTask[] = []

export async function initScheduler(): Promise<void> {
	const config = getAppConfig()

	if (!config.schedulerEnabled) {
		log.info("Scheduler disabled. Set SCHEDULE_ENABLED=true to enable.")
		return
	}

	log.info("Initializing scheduler...")

	scheduledTasks.forEach((task) => task.stop())
	scheduledTasks = []

	const { time1, time2 } = await getTriggerTimes()
	const cron1 = timeToCron(time1)
	const cron2 = timeToCron(time2)

	const task1 = cron.schedule(
		cron1,
		async () => {
			const isEnabled = await getSchedulerEnabled()
			if (!isEnabled) return
			await sendScheduledSlackMessage(time1, "evening")
		},
		{ timezone: TIMEZONE.NAME }
	)

	const task2 = cron.schedule(
		cron2,
		async () => {
			const isEnabled = await getSchedulerEnabled()
			if (!isEnabled) return
			await sendScheduledSlackMessage(time2, "night")
		},
		{ timezone: TIMEZONE.NAME }
	)

	const commentTask = cron.schedule(
		"* * * * *",
		async () => {
			const isEnabled = await getSchedulerEnabled()
			if (!isEnabled) return
			await checkAndPostScheduledComments()
		},
		{ timezone: TIMEZONE.NAME }
	)

	const backupTask = cron.schedule(
		"0 * * * *",
		async () => {
			await runHourlyBackup()
		},
		{ timezone: TIMEZONE.NAME }
	)

	scheduledTasks.push(task1, task2, commentTask, backupTask)

	log.info("Scheduler initialized", {
		eveningShift: `${time1} ${TIMEZONE.OFFSET}`,
		nightShift: `${time2} ${TIMEZONE.OFFSET}`,
		commentChecker: "every minute",
		backup: "hourly",
	})
}

export function stopScheduler(): void {
	log.info("Stopping all scheduled tasks...")
	scheduledTasks.forEach((task) => task.stop())
	scheduledTasks = []
	log.info("Scheduler stopped")
}

export async function triggerScheduledTask(): Promise<void> {
	log.info("Manual trigger for both shifts")
	await sendScheduledSlackMessage("Manual - Evening", "evening")
	await sendScheduledSlackMessage("Manual - Night", "night")
}

export { timeToCron, shouldRunCronNow, isCronMatchingNow, matchesCronPart } from "./cron-utils"
export { sendScheduledSlackMessage, checkAndReplyToHandoverMessages } from "./shift-scheduler"
export { checkAndPostScheduledComments } from "./comment-scheduler"
export { runHourlyBackup } from "./backup-scheduler"
