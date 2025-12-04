import { z } from "zod";
import { router, publicProcedure } from "../server";
import { getBackups, createBackup, restoreFromBackup } from "@/lib/services";

export const backupRouter = router({
  getAll: publicProcedure.query(async () => {
    const backups = await getBackups();
    // Transform to match BackupItem format
    const transformedBackups = backups.map((b) => ({
      id: b.id,
      backup_type: b.backup_type,
      created_at: typeof b.created_at === 'string' ? b.created_at : b.created_at.toISOString(),
      description: b.description,
      ticket_count: b.ticket_data ? Object.keys(b.ticket_data).length : 0,
      settings_count: b.app_settings ? Object.keys(b.app_settings).length : 0,
      comments_count: b.scheduled_comments ? b.scheduled_comments.length : 0,
    }));
    return { success: true, backups: transformedBackups };
  }),

  create: publicProcedure
    .input(
      z.object({
        type: z.enum(["auto", "manual"]).optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const backupType = input.type || "auto";
      const backup = await createBackup(backupType, input.description);
      return { success: true, backup };
    }),

  restore: publicProcedure
    .input(
      z.object({
        backupId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await restoreFromBackup(input.backupId);
      return { success: true };
    }),
});
