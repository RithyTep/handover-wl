import { getBackupService } from '../../services/backup.service'
import { backupRestoreSchema } from '~/types/backup'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = backupRestoreSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid backup ID',
    })
  }

  const backupService = getBackupService()
  const success = await backupService.restore(parsed.data.backupId)

  if (!success) {
    throw createError({
      statusCode: 404,
      message: 'Backup not found',
    })
  }

  return { success: true }
})
