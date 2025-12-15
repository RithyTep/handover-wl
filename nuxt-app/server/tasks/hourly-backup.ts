import { BackupType } from '~/enums'
import { getBackupService } from '../services/backup.service'
import { BACKUP } from '../utils/config'

export default defineTask({
  meta: {
    name: 'hourly-backup',
    description: 'Creates automatic hourly backups and cleans up old ones',
  },
  async run() {
    console.info('[Scheduler] Running hourly backup...')

    try {
      const backupService = getBackupService()
      const backup = await backupService.create(BackupType.AUTO, 'Hourly automatic backup')

      if (backup) {
        console.info('[Scheduler] Backup created', { backupId: backup.id })
        await backupService.cleanupOld(BACKUP.MAX_COUNT)
      }

      return { result: { success: true, backupId: backup.id } }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error('[Scheduler] Backup failed', { error: message })
      return { result: { success: false, error: message } }
    }
  },
})
