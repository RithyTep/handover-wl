import { BackupType } from "@/enums"
import { BackupRepository } from "@/server/repository/backup.repository"
import { SettingsRepository } from "@/server/repository/settings.repository"
import { TicketRepository } from "@/server/repository/ticket.repository"
import { ScheduledCommentRepository } from "@/server/repository/scheduled-comment.repository"
import { BACKUP } from "@/lib/config"
import type { Backup, BackupItem } from "@/lib/types"

export class BackupService {
	private backupRepo: BackupRepository
	private settingsRepo: SettingsRepository
	private ticketRepo: TicketRepository
	private commentRepo: ScheduledCommentRepository

	constructor() {
		this.backupRepo = new BackupRepository()
		this.settingsRepo = new SettingsRepository()
		this.ticketRepo = new TicketRepository()
		this.commentRepo = new ScheduledCommentRepository()
	}

	async getAll(limit: number = BACKUP.FETCH_LIMIT): Promise<Backup[]> {
		return this.backupRepo.findAll(limit)
	}

	async getAllItems(limit: number = BACKUP.FETCH_LIMIT): Promise<BackupItem[]> {
		const backups = await this.backupRepo.findAll(limit)
		return backups.map((b) => this.transformToItem(b))
	}

	async getById(id: number): Promise<Backup | null> {
		return this.backupRepo.findById(id)
	}

	async create(backupType: BackupType, description?: string): Promise<Backup> {
		const ticketRows = await this.ticketRepo.findAll()
		const ticketData: Record<string, { status: string; action: string }> = {}
		for (const row of ticketRows) {
			ticketData[row.ticket_key] = { status: row.status, action: row.action }
		}

		const settingRows = await this.settingsRepo.findAll()
		const appSettings: Record<string, string> = {}
		for (const row of settingRows) {
			appSettings[row.key] = row.value
		}

		const comments = await this.commentRepo.findAll()
		const scheduledComments = comments.map((c) => ({
			comment_type: c.comment_type,
			ticket_key: c.ticket_key ?? null,
			comment_text: c.comment_text,
			cron_schedule: c.cron_schedule,
			enabled: c.enabled,
		}))

		return this.backupRepo.insert(
			backupType,
			{ ticketData, appSettings, scheduledComments },
			description
		)
	}

	async restore(backupId: number): Promise<boolean> {
		const backup = await this.backupRepo.findById(backupId)
		if (!backup) return false

		if (backup.ticket_data) {
			await this.backupRepo.restoreTicketData(backup.ticket_data)
		}

		if (backup.app_settings) {
			await this.backupRepo.restoreAppSettings(backup.app_settings)
		}

		if (backup.scheduled_comments) {
			const commentsToRestore = backup.scheduled_comments.map((c) => ({
				comment_type: String(c.comment_type),
				ticket_key: c.ticket_key ?? null,
				comment_text: c.comment_text,
				cron_schedule: c.cron_schedule,
				enabled: c.enabled,
			}))
			await this.backupRepo.restoreScheduledComments(commentsToRestore)
		}

		return true
	}

	async cleanupOld(keepCount: number = BACKUP.MAX_COUNT): Promise<number> {
		return this.backupRepo.deleteOldBackups(keepCount)
	}

	transformToItem(backup: Backup): BackupItem {
		return {
			id: backup.id,
			backup_type: backup.backup_type,
			created_at: backup.created_at instanceof Date ? backup.created_at.toISOString() : String(backup.created_at),
			description: backup.description,
			ticket_count: backup.ticket_data ? Object.keys(backup.ticket_data).length : 0,
			settings_count: backup.app_settings ? Object.keys(backup.app_settings).length : 0,
			comments_count: backup.scheduled_comments ? backup.scheduled_comments.length : 0,
		}
	}
}
