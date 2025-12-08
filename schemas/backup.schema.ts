import { z } from "zod"
import { BackupType } from "@/enums"

export const backupTypeSchema = z.nativeEnum(BackupType)

export const backupCreateSchema = z.object({
	backup_type: backupTypeSchema,
	description: z.string().optional(),
})

export const backupRestoreSchema = z.object({
	backupId: z.number().int().positive(),
})

export const backupDeleteSchema = z.object({
	backupId: z.number().int().positive(),
})

export type BackupCreateRequest = z.infer<typeof backupCreateSchema>
export type BackupRestoreRequest = z.infer<typeof backupRestoreSchema>
export type BackupDeleteRequest = z.infer<typeof backupDeleteSchema>
