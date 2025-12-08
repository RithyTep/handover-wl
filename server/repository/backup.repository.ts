import { prisma } from "@/lib/prisma"
import { BackupType } from "@/enums"
import type { Backup as PrismaBackup, Prisma } from "@/lib/generated/prisma"
import type { Backup, ScheduledComment } from "@/lib/types"

interface BackupData {
	ticketData: Record<string, { status: string; action: string }>
	appSettings: Record<string, string>
	scheduledComments: Array<{
		comment_type: string
		ticket_key: string | null
		comment_text: string
		cron_schedule: string
		enabled: boolean
	}>
}

function toDomain(row: PrismaBackup): Backup {
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

export class BackupRepository {
	async findAll(limit: number): Promise<Backup[]> {
		const rows = await prisma.backup.findMany({
			orderBy: { createdAt: "desc" },
			take: limit,
		})
		return rows.map(toDomain)
	}

	async findById(id: number): Promise<Backup | null> {
		const row = await prisma.backup.findUnique({
			where: { id },
		})
		return row ? toDomain(row) : null
	}

	async insert(
		backupType: BackupType,
		data: BackupData,
		description?: string
	): Promise<Backup> {
		const row = await prisma.backup.create({
			data: {
				backupType,
				ticketData: data.ticketData as Prisma.InputJsonValue,
				appSettings: data.appSettings as Prisma.InputJsonValue,
				scheduledComments: data.scheduledComments as Prisma.InputJsonValue,
				description,
			},
		})
		return toDomain(row)
	}

	async delete(id: number): Promise<boolean> {
		try {
			await prisma.backup.delete({
				where: { id },
			})
			return true
		} catch {
			return false
		}
	}

	async deleteOldBackups(keepCount: number): Promise<number> {
		const backupsToKeep = await prisma.backup.findMany({
			orderBy: { createdAt: "desc" },
			take: keepCount,
			select: { id: true },
		})

		const keepIds = backupsToKeep.map((b) => b.id)

		const result = await prisma.backup.deleteMany({
			where: {
				id: { notIn: keepIds },
			},
		})

		return result.count
	}

	async restoreTicketData(tickets: Record<string, { status: string; action: string }>): Promise<void> {
		await prisma.$transaction(async (tx) => {
			await tx.ticketData.deleteMany()
			await tx.ticketData.createMany({
				data: Object.entries(tickets).map(([ticketKey, data]) => ({
					ticketKey,
					status: data.status,
					action: data.action,
				})),
			})
		})
	}

	async restoreAppSettings(settings: Record<string, string>): Promise<void> {
		await prisma.$transaction(
			Object.entries(settings).map(([key, value]) =>
				prisma.appSetting.upsert({
					where: { key },
					update: { value, updatedAt: new Date() },
					create: { key, value },
				})
			)
		)
	}

	async restoreScheduledComments(
		comments: Array<{
			comment_type: string
			ticket_key: string | null
			comment_text: string
			cron_schedule: string
			enabled: boolean
		}>
	): Promise<void> {
		await prisma.$transaction(async (tx) => {
			await tx.scheduledComment.deleteMany()
			await tx.scheduledComment.createMany({
				data: comments.map((c) => ({
					commentType: c.comment_type,
					ticketKey: c.ticket_key,
					commentText: c.comment_text,
					cronSchedule: c.cron_schedule,
					enabled: c.enabled,
				})),
			})
		})
	}
}
