import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { SCHEDULER } from "@/lib/config"

const log = logger.db

export async function initDatabase(): Promise<void> {
	log.info("Initializing database...")

	await prisma.$transaction([
		prisma.appSetting.upsert({
			where: { key: "scheduler_enabled" },
			update: {},
			create: { key: "scheduler_enabled", value: "true" },
		}),
		prisma.appSetting.upsert({
			where: { key: "trigger_time_1" },
			update: {},
			create: { key: "trigger_time_1", value: SCHEDULER.DEFAULT_TIME_1 },
		}),
		prisma.appSetting.upsert({
			where: { key: "trigger_time_2" },
			update: {},
			create: { key: "trigger_time_2", value: SCHEDULER.DEFAULT_TIME_2 },
		}),
	])

	log.info("Database initialized successfully")
}

export async function checkHealth(): Promise<{
	healthy: boolean
	latency: number
	error?: string
}> {
	const start = Date.now()
	try {
		await prisma.$queryRaw`SELECT 1`
		return {
			healthy: true,
			latency: Date.now() - start,
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

export async function shutdown(): Promise<void> {
	log.info("Shutting down database connections...")
	await prisma.$disconnect()
	log.info("Database connections closed")
}

export { saveTicketData, loadTicketData } from "./ticket-database"

export {
	getBackups,
	getBackupById,
	createBackup,
	restoreFromBackup,
	cleanupOldBackups,
	transformBackupToItem,
} from "./backup-database"

export {
	getScheduledComments,
	getEnabledScheduledComments,
	createScheduledComment,
	updateScheduledComment,
	deleteScheduledComment,
	updateCommentLastPosted,
} from "./scheduled-comment-database"

export type {
	CreateScheduledCommentOptions,
	UpdateScheduledCommentOptions,
} from "./scheduled-comment-database"

export {
	getSetting,
	setSetting,
	getSchedulerEnabled,
	setSchedulerEnabled,
	getTriggerTimes,
	setTriggerTimes,
	getCustomChannelId,
	setCustomChannelId,
	getMemberMentions,
	setMemberMentions,
	getEveningUserToken,
	setEveningUserToken,
	getNightUserToken,
	setNightUserToken,
	getEveningMentions,
	setEveningMentions,
	getNightMentions,
	setNightMentions,
	getThemePreference,
	setThemePreference,
} from "./settings-database"
