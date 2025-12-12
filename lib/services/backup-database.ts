import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { BACKUP } from "@/lib/config"
import { BackupType } from "@/enums"
import type { Backup, BackupItem, ScheduledComment } from "@/lib/types"
import type { Prisma } from "@/lib/generated/prisma"

const log = logger.db

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

export async function getBackups(limit: number = BACKUP.FETCH_LIMIT): Promise<Backup[]> {
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

export async function getBackupById(id: number): Promise<Backup | null> {
	try {
		const row = await prisma.backup.findUnique({ where: { id } })
		return row ? transformBackup(row) : null
	} catch {
		return null
	}
}

export async function createBackup(
	backupType: "auto" | "manual" = "auto",
	description?: string
): Promise<Backup | null> {
	log.info("Creating backup", { type: backupType })
	try {
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

export async function cleanupOldBackups(keepCount: number = BACKUP.MAX_COUNT): Promise<number> {
	try {
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

export function transformBackupToItem(backup: Backup): BackupItem {
	return {
		id: backup.id,
		backup_type: backup.backup_type,
		created_at:
			backup.created_at instanceof Date
				? backup.created_at.toISOString()
				: String(backup.created_at),
		description: backup.description,
		ticket_count: backup.ticket_data ? Object.keys(backup.ticket_data).length : 0,
		settings_count: backup.app_settings ? Object.keys(backup.app_settings).length : 0,
		comments_count: backup.scheduled_comments ? backup.scheduled_comments.length : 0,
	}
}
