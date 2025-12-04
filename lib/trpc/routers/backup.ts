import { router, publicProcedure } from "@/server/trpc/server";
import { BackupService } from "@/server/services/backup.service";
import { backupCreateSchema, backupRestoreSchema } from "@/schemas/backup.schema";
import { BackupType } from "@/enums/backup.enum";

const backupService = new BackupService();

export const backupRouter = router({
  getAll: publicProcedure.query(async () => {
    const backups = await backupService.getAll();
    const transformedBackups = backups.map((b) => backupService.transformToItem(b));
    return { success: true, backups: transformedBackups };
  }),

  create: publicProcedure
    .input(backupCreateSchema)
    .mutation(async ({ input }) => {
      const backup = await backupService.create(input.backup_type, input.description);
      return { success: true, backup: backupService.transformToItem(backup) };
    }),

  restore: publicProcedure
    .input(backupRestoreSchema)
    .mutation(async ({ input }) => {
      await backupService.restore(input.backupId);
      return { success: true };
    }),
});
