<script setup lang="ts">
import { Database, RefreshCw, AlertTriangle } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import {
  BackupStats,
  BackupTable,
  RestoreDialog,
  type BackupItem,
} from '~/components/backup'

// Composable for backup data
const { backups, stats, isLoading, refetch, restore, isRestoring } = useBackups()

// Toast notifications
const { $toast } = useNuxtApp()

// Restore dialog state
const restoreDialog = ref(false)
const selectedBackup = ref<BackupItem | null>(null)

const handleRefresh = async () => {
  await refetch()
  $toast?.success('Backups refreshed')
}

const openRestoreDialog = (backup: BackupItem) => {
  selectedBackup.value = backup
  restoreDialog.value = true
}

const handleRestore = async () => {
  if (!selectedBackup.value) return

  try {
    await restore(selectedBackup.value.id)
    $toast?.success(`Restored from backup #${selectedBackup.value.id}`)
    restoreDialog.value = false
    selectedBackup.value = null
  } catch (e) {
    $toast?.error(`Error restoring backup: ${(e as Error).message}`)
  }
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <header
      class="sticky top-0 z-50 h-[52px] border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div class="flex h-full items-center justify-between px-6">
        <div class="flex items-center gap-3">
          <Database class="h-5 w-5 text-primary" />
          <h1 class="text-lg font-semibold">Backup Manager</h1>
          <span class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
            Auto-backup every hour
          </span>
        </div>

        <div class="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            :disabled="isLoading"
            @click="handleRefresh"
          >
            <RefreshCw :class="['h-4 w-4', isLoading ? 'animate-spin' : '']" />
          </Button>
        </div>
      </div>
    </header>

    <BackupStats
      :total="stats.total"
      :auto="stats.auto"
      :manual="stats.manual"
      :latest="stats.latest"
    />

    <div class="px-6 pb-6">
      <BackupTable :backups="backups" @restore="openRestoreDialog" />

      <div class="mt-4 p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
        <div class="flex items-start gap-3">
          <AlertTriangle class="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-yellow-500">Backup Information</p>
            <ul class="text-sm text-muted-foreground mt-1 space-y-1">
              <li>Auto backups run every hour at minute 0</li>
              <li>
                Only the last 24 backups are kept (older ones are automatically
                deleted)
              </li>
              <li>
                Restoring will replace all current data with the backup data
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <RestoreDialog
      v-model:open="restoreDialog"
      :backup="selectedBackup"
      :restoring="isRestoring"
      @restore="handleRestore"
    />
  </div>
</template>
