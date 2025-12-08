import type { IBackup, IBackupItem } from "../common/backup.interface"

export interface IGetBackupsResponse {
	backups: IBackupItem[]
}

export interface IGetBackupResponse {
	backup: IBackup
}

export interface ICreateBackupResponse {
	backup: IBackupItem
}

export interface IRestoreBackupResponse {
	restoredTickets: number
	restoredSettings: number
	restoredComments: number
}
