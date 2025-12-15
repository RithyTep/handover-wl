<script setup lang="ts">
import { AlertTriangle, Upload } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog'
import { Badge } from '~/components/ui/badge'
import type { BackupItem } from './backup-types'
import { formatDate } from './backup-types'

interface Props {
  backup: BackupItem | null
  restoring: boolean
}

interface Emits {
  (e: 'restore'): void
}

defineProps<Props>()
defineEmits<Emits>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <AlertTriangle class="h-5 w-5 text-yellow-500" />
          Restore from Backup #{{ backup?.id }}
        </DialogTitle>
        <DialogDescription class="text-destructive">
          This will replace ALL current data with the backup data. This action
          cannot be undone. Make sure to create a backup first if needed.
        </DialogDescription>
      </DialogHeader>
      <div v-if="backup" class="py-4 space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-muted-foreground">Created:</span>
          <span>{{ formatDate(backup.created_at) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-muted-foreground">Type:</span>
          <Badge :variant="backup.backup_type === 'auto' ? 'secondary' : 'default'">
            {{ backup.backup_type }}
          </Badge>
        </div>
        <div class="flex justify-between">
          <span class="text-muted-foreground">Tickets:</span>
          <span>{{ backup.ticket_count }} items</span>
        </div>
        <div class="flex justify-between">
          <span class="text-muted-foreground">Settings:</span>
          <span>{{ backup.settings_count }} items</span>
        </div>
        <div class="flex justify-between">
          <span class="text-muted-foreground">Scheduled Comments:</span>
          <span>{{ backup.comments_count }} items</span>
        </div>
      </div>
      <DialogFooter>
        <Button variant="ghost" @click="open = false">
          Cancel
        </Button>
        <Button
          variant="destructive"
          :disabled="restoring"
          @click="$emit('restore')"
        >
          <Upload :class="['h-4 w-4 mr-2', restoring ? 'animate-pulse' : '']" />
          {{ restoring ? 'Restoring...' : 'Restore Backup' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
