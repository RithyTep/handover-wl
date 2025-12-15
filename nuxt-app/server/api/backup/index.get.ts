import { getBackupService } from '../../services/backup.service'

export default defineEventHandler(async () => {
  const backupService = getBackupService()
  const backups = await backupService.getAllItems()

  return {
    success: true,
    backups,
  }
})
