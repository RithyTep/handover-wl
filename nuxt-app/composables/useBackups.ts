import type { BackupItem, BackupStats } from '~/components/backup/backup-types'
import { getBackupStats } from '~/components/backup/backup-types'

interface UseBackupsReturn {
  backups: Ref<BackupItem[]>
  stats: ComputedRef<BackupStats>
  isLoading: Ref<boolean>
  error: Ref<Error | null>
  refetch: () => Promise<void>
  restore: (backupId: number) => Promise<void>
  isRestoring: Ref<boolean>
}

export function useBackups(): UseBackupsReturn {
  const backups = ref<BackupItem[]>([])
  const isLoading = ref(true)
  const error = ref<Error | null>(null)
  const isRestoring = ref(false)

  const stats = computed(() => getBackupStats(backups.value))

  const fetchBackups = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ backups: BackupItem[] }>('/api/backup')
      backups.value = response.backups
    } catch (e) {
      error.value = e as Error
      console.error('Failed to fetch backups:', e)
    } finally {
      isLoading.value = false
    }
  }

  const restore = async (backupId: number) => {
    isRestoring.value = true

    try {
      await $fetch('/api/backup/restore', {
        method: 'POST',
        body: { backupId },
      })
      await fetchBackups()
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      isRestoring.value = false
    }
  }

  onMounted(() => {
    fetchBackups()
  })

  return {
    backups,
    stats,
    isLoading,
    error,
    refetch: fetchBackups,
    restore,
    isRestoring,
  }
}
