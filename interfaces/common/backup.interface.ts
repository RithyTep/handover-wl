import type { BackupType } from "@/enums"
import type { IScheduledComment } from "./scheduled-comment.interface"

export interface ITicketDataRecord {
	status: string
	action: string
}

export interface IBackup {
	id: number
	backup_type: BackupType
	ticket_data: Record<string, ITicketDataRecord> | null
	app_settings: Record<string, string> | null
	scheduled_comments: IScheduledComment[] | null
	created_at: Date
	description: string | null
}

export interface IBackupItem {
	id: number
	backup_type: BackupType
	created_at: string
	description: string | null
	ticket_count: number
	settings_count: number
	comments_count: number
}
