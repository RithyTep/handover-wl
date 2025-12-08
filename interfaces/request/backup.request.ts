import type { BackupType } from "@/enums"

export interface ICreateBackupRequest {
	backup_type: BackupType
	description?: string
}

export interface IRestoreBackupRequest {
	backupId: number
}
