import { getBackupService } from '../../services/backup.service'
import { backupCreateSchema } from '~/types/backup'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = backupCreateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid backup type',
    })
  }

  const backupService = getBackupService()
  const backup = await backupService.create(parsed.data.backup_type, parsed.data.description)

  return {
    success: true,
    backup: backupService.transformToItem(backup),
  }
})
