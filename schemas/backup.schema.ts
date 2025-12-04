import { z } from "zod";
import { BackupType } from "@/enums/backup.enum";

export const backupCreateSchema = z.object({
  backup_type: z.nativeEnum(BackupType),
  description: z.string().optional(),
});

export const backupRestoreSchema = z.object({
  backupId: z.number(),
});
