import { z } from "zod"
import { BackupType, BackupTypeValues } from "@/enums"
import type { ScheduledComment } from "./scheduled-comment"
import type { TicketData } from "./ticket"

export { BackupType }

export const BACKUP_TYPE_VALUES = BackupTypeValues

export const backupTypeSchema = z.nativeEnum(BackupType)

export interface BackupItem {
	id: number
	backup_type: BackupType
	created_at: string
	description: string | null
	ticket_count: number
	settings_count: number
	comments_count: number
}

export interface Backup {
	id: number
	backup_type: BackupType
	ticket_data: Record<string, TicketData> | null
	app_settings: Record<string, string> | null
	scheduled_comments: ScheduledComment[] | null
	created_at: Date
	description: string | null
}
