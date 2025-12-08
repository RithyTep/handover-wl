/**
 * Database Service
 * Implements Twelve-Factor App methodology:
 * - Factor IV: Backing Services (treat database as attached resource)
 * - Factor VI: Processes (stateless processes, store data in backing service)
 * - Factor IX: Disposability (fast startup, graceful shutdown)
 */

import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { SCHEDULER, BACKUP } from "@/lib/config"
import { Theme, CommentType, BackupType } from "@/enums"
import { isValidTheme } from "@/lib/types"
import type {
	TicketData,
	ScheduledComment,
	Backup,
	BackupItem,
} from "@/lib/types"
import type { Prisma } from "@/lib/generated/prisma"

const log = logger.db

/**
 * Initialize database schema
 * Creates default settings if they don't exist (idempotent operation)
 */
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

/**
 * Save ticket data to database
 */
export async function saveTicketData(
	tickets: Record<string, { status: string; action: string }>
): Promise<void> {
	const ticketCount = Object.keys(tickets).length
	log.info("Saving ticket data", { count: ticketCount })

	await prisma.$transaction(
		Object.entries(tickets).map(([ticketKey, data]) =>
			prisma.ticketData.upsert({
				where: { ticketKey },
				update: { status: data.status, action: data.action, updatedAt: new Date() },
				create: { ticketKey, status: data.status, action: data.action },
			})
		)
	)

	log.info("Ticket data saved", { count: ticketCount })
}

/**
 * Load all ticket data from database
 */
export async function loadTicketData(): Promise<Record<string, TicketData>> {
	try {
		const rows = await prisma.ticketData.findMany()
		const data: Record<string, TicketData> = {}
		for (const row of rows) {
			data[row.ticketKey] = {
				status: row.status,
				action: row.action,
				updated_at: row.updatedAt?.toISOString(),
			}
		}
		log.info("Ticket data loaded", { count: rows.length })
		return data
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Failed to load ticket data", { error: message })
		return {}
	}
}

/**
 * Get scheduler enabled status
 */
export async function getSchedulerEnabled(): Promise<boolean> {
	try {
		const setting = await prisma.appSetting.findUnique({
			where: { key: "scheduler_enabled" },
		})
		return setting?.value === "true"
	} catch {
		return true
	}
}

/**
 * Set scheduler enabled status
 */
export async function setSchedulerEnabled(enabled: boolean): Promise<void> {
	log.info("Updating scheduler status", { enabled })
	await prisma.appSetting.upsert({
		where: { key: "scheduler_enabled" },
		update: { value: enabled.toString(), updatedAt: new Date() },
		create: { key: "scheduler_enabled", value: enabled.toString() },
	})
}

/**
 * Get all scheduled comments
 */
export async function getScheduledComments(): Promise<ScheduledComment[]> {
	try {
		const rows = await prisma.scheduledComment.findMany({
			orderBy: { createdAt: "desc" },
		})
		return rows.map(transformScheduledComment)
	} catch {
		return []
	}
}

/**
 * Get enabled scheduled comments only
 */
export async function getEnabledScheduledComments(): Promise<ScheduledComment[]> {
	try {
		const rows = await prisma.scheduledComment.findMany({
			where: { enabled: true },
			orderBy: { createdAt: "desc" },
		})
		return rows.map(transformScheduledComment)
	} catch {
		return []
	}
}

/**
 * Transform Prisma scheduled comment to domain type
 */
function transformScheduledComment(row: {
	id: number
	commentType: string
	ticketKey: string | null
	commentText: string
	cronSchedule: string
	enabled: boolean
	createdAt: Date
	updatedAt: Date
	lastPostedAt: Date | null
}): ScheduledComment {
	return {
		id: row.id,
		comment_type: row.commentType as CommentType,
		ticket_key: row.ticketKey ?? undefined,
		comment_text: row.commentText,
		cron_schedule: row.cronSchedule,
		enabled: row.enabled,
		created_at: row.createdAt,
		updated_at: row.updatedAt,
		last_posted_at: row.lastPostedAt,
	}
}

/**
 * Create a new scheduled comment
 */
export async function createScheduledComment(
	commentType: "jira" | "slack",
	commentText: string,
	cronSchedule: string,
	enabled: boolean = true,
	ticketKey?: string
): Promise<ScheduledComment | null> {
	log.info("Creating scheduled comment", { commentType, ticketKey })
	try {
		const row = await prisma.scheduledComment.create({
			data: {
				commentType,
				ticketKey: ticketKey || null,
				commentText,
				cronSchedule,
				enabled,
			},
		})
		return transformScheduledComment(row)
	} catch {
		return null
	}
}

/**
 * Update an existing scheduled comment
 */
export async function updateScheduledComment(
	id: number,
	commentType: "jira" | "slack",
	commentText: string,
	cronSchedule: string,
	enabled: boolean,
	ticketKey?: string
): Promise<ScheduledComment | null> {
	log.info("Updating scheduled comment", { id, commentType })
	try {
		const row = await prisma.scheduledComment.update({
			where: { id },
			data: {
				commentType,
				ticketKey: ticketKey || null,
				commentText,
				cronSchedule,
				enabled,
				updatedAt: new Date(),
			},
		})
		return transformScheduledComment(row)
	} catch {
		return null
	}
}

/**
 * Delete a scheduled comment
 */
export async function deleteScheduledComment(id: number): Promise<boolean> {
	log.info("Deleting scheduled comment", { id })
	try {
		await prisma.scheduledComment.delete({ where: { id } })
		return true
	} catch {
		return false
	}
}

/**
 * Update the last posted timestamp for a comment
 */
export async function updateCommentLastPosted(id: number): Promise<void> {
	await prisma.scheduledComment.update({
		where: { id },
		data: { lastPostedAt: new Date() },
	})
}

/**
 * Get trigger times for scheduled tasks
 */
export async function getTriggerTimes(): Promise<{
	time1: string
	time2: string
}> {
	try {
		const settings = await prisma.appSetting.findMany({
			where: {
				key: { in: ["trigger_time_1", "trigger_time_2"] },
			},
		})
		const times: { time1: string; time2: string } = {
			time1: SCHEDULER.DEFAULT_TIME_1,
			time2: SCHEDULER.DEFAULT_TIME_2,
		}
		for (const setting of settings) {
			if (setting.key === "trigger_time_1") times.time1 = setting.value
			if (setting.key === "trigger_time_2") times.time2 = setting.value
		}
		return times
	} catch {
		return { time1: SCHEDULER.DEFAULT_TIME_1, time2: SCHEDULER.DEFAULT_TIME_2 }
	}
}

/**
 * Set trigger times for scheduled tasks
 */
export async function setTriggerTimes(
	time1: string,
	time2: string
): Promise<void> {
	log.info("Updating trigger times", { time1, time2 })
	await prisma.$transaction([
		prisma.appSetting.upsert({
			where: { key: "trigger_time_1" },
			update: { value: time1, updatedAt: new Date() },
			create: { key: "trigger_time_1", value: time1 },
		}),
		prisma.appSetting.upsert({
			where: { key: "trigger_time_2" },
			update: { value: time2, updatedAt: new Date() },
			create: { key: "trigger_time_2", value: time2 },
		}),
	])
}

/**
 * Get a setting value by key
 */
export async function getSetting(key: string): Promise<string | null> {
	try {
		const setting = await prisma.appSetting.findUnique({ where: { key } })
		return setting?.value || null
	} catch {
		return null
	}
}

/**
 * Set a setting value
 */
export async function setSetting(key: string, value: string): Promise<void> {
	await prisma.appSetting.upsert({
		where: { key },
		update: { value, updatedAt: new Date() },
		create: { key, value },
	})
}

/**
 * Get all backups
 */
export async function getBackups(
	limit: number = BACKUP.FETCH_LIMIT
): Promise<Backup[]> {
	try {
		const rows = await prisma.backup.findMany({
			orderBy: { createdAt: "desc" },
			take: limit,
		})
		return rows.map(transformBackup)
	} catch {
		return []
	}
}

/**
 * Get a backup by ID
 */
export async function getBackupById(id: number): Promise<Backup | null> {
	try {
		const row = await prisma.backup.findUnique({ where: { id } })
		return row ? transformBackup(row) : null
	} catch {
		return null
	}
}

/**
 * Transform Prisma backup to domain type
 */
function transformBackup(row: {
	id: number
	backupType: string
	ticketData: Prisma.JsonValue
	appSettings: Prisma.JsonValue
	scheduledComments: Prisma.JsonValue
	createdAt: Date
	description: string | null
}): Backup {
	return {
		id: row.id,
		backup_type: row.backupType as BackupType,
		ticket_data: row.ticketData as Record<string, { status: string; action: string }> | null,
		app_settings: row.appSettings as Record<string, string> | null,
		scheduled_comments: row.scheduledComments as ScheduledComment[] | null,
		created_at: row.createdAt,
		description: row.description,
	}
}

/**
 * Create a new backup
 */
export async function createBackup(
	backupType: "auto" | "manual" = "auto",
	description?: string
): Promise<Backup | null> {
	log.info("Creating backup", { type: backupType })
	try {
		// Gather all data
		const ticketRows = await prisma.ticketData.findMany()
		const tickets: Record<string, { status: string; action: string }> = {}
		for (const row of ticketRows) {
			tickets[row.ticketKey] = { status: row.status, action: row.action }
		}

		const settingsRows = await prisma.appSetting.findMany()
		const settings: Record<string, string> = {}
		for (const row of settingsRows) {
			settings[row.key] = row.value
		}

		const commentsRows = await prisma.scheduledComment.findMany()

		const row = await prisma.backup.create({
			data: {
				backupType,
				ticketData: tickets as Prisma.InputJsonValue,
				appSettings: settings as Prisma.InputJsonValue,
				scheduledComments: commentsRows as unknown as Prisma.InputJsonValue,
				description,
			},
		})

		log.info("Backup created", { id: row.id })
		return transformBackup(row)
	} catch {
		return null
	}
}

/**
 * Restore from a backup
 */
export async function restoreFromBackup(backupId: number): Promise<boolean> {
	log.info("Restoring from backup", { backupId })
	const backup = await getBackupById(backupId)
	if (!backup) {
		log.error("Backup not found", { backupId })
		return false
	}

	try {
		await prisma.$transaction(async (tx) => {
			if (backup.ticket_data) {
				await tx.ticketData.deleteMany()
				for (const [key, data] of Object.entries(backup.ticket_data)) {
					await tx.ticketData.create({
						data: { ticketKey: key, status: data.status, action: data.action },
					})
				}
			}

			if (backup.app_settings) {
				for (const [key, value] of Object.entries(backup.app_settings)) {
					await tx.appSetting.upsert({
						where: { key },
						update: { value, updatedAt: new Date() },
						create: { key, value },
					})
				}
			}

			if (backup.scheduled_comments) {
				await tx.scheduledComment.deleteMany()
				for (const comment of backup.scheduled_comments) {
					await tx.scheduledComment.create({
						data: {
							commentType: comment.comment_type,
							ticketKey: comment.ticket_key,
							commentText: comment.comment_text,
							cronSchedule: comment.cron_schedule,
							enabled: comment.enabled,
						},
					})
				}
			}
		})

		log.info("Backup restored successfully", { backupId })
		return true
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Failed to restore backup", { backupId, error: message })
		return false
	}
}

/**
 * Cleanup old backups, keeping only the most recent ones
 */
export async function cleanupOldBackups(
	keepCount: number = BACKUP.MAX_COUNT
): Promise<number> {
	try {
		// Get IDs to keep
		const toKeep = await prisma.backup.findMany({
			select: { id: true },
			orderBy: { createdAt: "desc" },
			take: keepCount,
		})
		const keepIds = toKeep.map((b) => b.id)

		if (keepIds.length === 0) {
			return 0
		}

		const result = await prisma.backup.deleteMany({
			where: { id: { notIn: keepIds } },
		})

		if (result.count > 0) {
			log.info("Old backups cleaned up", { deleted: result.count, kept: keepCount })
		}
		return result.count
	} catch {
		return 0
	}
}

/**
 * Transform backup to display item format
 */
export async function transformBackupToItem(backup: Backup): Promise<BackupItem> {
	return {
		id: backup.id,
		backup_type: backup.backup_type,
		created_at:
			backup.created_at instanceof Date
				? backup.created_at.toISOString()
				: String(backup.created_at),
		description: backup.description,
		ticket_count: backup.ticket_data ? Object.keys(backup.ticket_data).length : 0,
		settings_count: backup.app_settings
			? Object.keys(backup.app_settings).length
			: 0,
		comments_count: backup.scheduled_comments
			? backup.scheduled_comments.length
			: 0,
	}
}

// Convenience exports for settings
export const getCustomChannelId = () => getSetting("custom_channel_id")
export const setCustomChannelId = (v: string) =>
	setSetting("custom_channel_id", v)

export const getMemberMentions = () => getSetting("member_mentions")
export const setMemberMentions = (v: string) => setSetting("member_mentions", v)

export const getEveningUserToken = () => getSetting("evening_user_token")
export const setEveningUserToken = (v: string) =>
	setSetting("evening_user_token", v)

export const getNightUserToken = () => getSetting("night_user_token")
export const setNightUserToken = (v: string) =>
	setSetting("night_user_token", v)

export const getEveningMentions = () => getSetting("evening_mentions")
export const setEveningMentions = (v: string) =>
	setSetting("evening_mentions", v)

export const getNightMentions = () => getSetting("night_mentions")
export const setNightMentions = (v: string) => setSetting("night_mentions", v)

export const getThemePreference = async (): Promise<Theme> => {
	const theme = await getSetting("theme_preference")
	if (theme && isValidTheme(theme)) {
		return theme
	}
	return Theme.DEFAULT
}

export const setThemePreference = async (theme: Theme): Promise<void> => {
	await setSetting("theme_preference", theme)
}

/**
 * Check database connection health
 * Used for health check endpoints (Factor IX: Disposability)
 */
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

/**
 * Graceful shutdown of database connections
 * Implements Factor IX: Disposability
 */
export async function shutdown(): Promise<void> {
	log.info("Shutting down database connections...")
	await prisma.$disconnect()
	log.info("Database connections closed")
}
