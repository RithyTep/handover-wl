<script setup lang="ts">
import { Database, Clock, FileText, Upload } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import type { BackupItem } from './backup-types'
import { formatDate, getRelativeTime } from './backup-types'

interface Props {
  backups: BackupItem[]
}

interface Emits {
  (e: 'restore', backup: BackupItem): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <div class="rounded-lg border bg-card">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[80px]">ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Description</TableHead>
          <TableHead class="text-center">Tickets</TableHead>
          <TableHead class="text-center">Settings</TableHead>
          <TableHead class="text-center">Comments</TableHead>
          <TableHead class="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="backups.length === 0">
          <TableCell :colspan="8" class="text-center py-8">
            <Database class="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p class="text-muted-foreground">No backups yet</p>
            <p class="text-sm text-muted-foreground/60">
              Create your first backup or wait for the hourly auto-backup
            </p>
          </TableCell>
        </TableRow>
        <template v-else>
          <TableRow
            v-for="(backup, index) in backups"
            :key="backup.id"
            :class="index === 0 ? 'bg-primary/5' : ''"
          >
            <TableCell class="font-mono text-sm">#{{ backup.id }}</TableCell>
            <TableCell>
              <Badge :variant="backup.backup_type === 'auto' ? 'secondary' : 'default'">
                <template v-if="backup.backup_type === 'auto'">
                  <Clock class="h-3 w-3 mr-1" /> Auto
                </template>
                <template v-else>
                  <FileText class="h-3 w-3 mr-1" /> Manual
                </template>
              </Badge>
            </TableCell>
            <TableCell>
              <div class="flex flex-col">
                <span class="text-sm">{{ formatDate(backup.created_at) }}</span>
                <span class="text-xs text-muted-foreground">
                  {{ getRelativeTime(backup.created_at) }}
                </span>
              </div>
            </TableCell>
            <TableCell class="text-muted-foreground text-sm">
              {{ backup.description || '-' }}
            </TableCell>
            <TableCell class="text-center">
              <Badge variant="outline">{{ backup.ticket_count }}</Badge>
            </TableCell>
            <TableCell class="text-center">
              <Badge variant="outline">{{ backup.settings_count }}</Badge>
            </TableCell>
            <TableCell class="text-center">
              <Badge variant="outline">{{ backup.comments_count }}</Badge>
            </TableCell>
            <TableCell class="text-right">
              <Button
                variant="ghost"
                size="sm"
                class="text-primary hover:text-primary"
                @click="$emit('restore', backup)"
              >
                <Upload class="h-4 w-4 mr-1" />
                Restore
              </Button>
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
