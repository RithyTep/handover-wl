import { router, publicProcedure, protectedMutation } from "@/server/trpc/server"
import { BackupService } from "@/server/services/backup.service"
import { backupCreateSchema, backupRestoreSchema } from "@/schemas/backup.schema"

const backupService = new BackupService()

export const backupRouter = router({
	getAll: publicProcedure.query(async () => {
		const backups = await backupService.getAllItems()
		return { success: true, backups }
	}),

	create: protectedMutation.input(backupCreateSchema).mutation(async ({ input }) => {
		const backup = await backupService.create(input.backup_type, input.description)
		return { success: true, backup: backupService.transformToItem(backup) }
	}),

	restore: protectedMutation
		.input(backupRestoreSchema)
		.mutation(async ({ input }) => {
			await backupService.restore(input.backupId)
			return { success: true }
		}),
})
