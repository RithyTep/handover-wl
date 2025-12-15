export enum BackupType {
  AUTO = 'auto',
  MANUAL = 'manual',
}

export const BackupTypeValues = Object.values(BackupType) as [BackupType, ...BackupType[]]
