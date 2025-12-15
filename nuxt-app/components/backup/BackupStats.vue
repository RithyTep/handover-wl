<script setup lang="ts">
import { HardDrive, Clock, FileText, Settings } from 'lucide-vue-next'

interface Props {
  total: number
  auto: number
  manual: number
  latest: string
}

defineProps<Props>()
</script>

<template>
  <div class="px-6 py-4 grid grid-cols-4 gap-4">
    <div class="rounded-lg border bg-card p-4">
      <div class="flex items-center gap-2 text-sm text-muted-foreground mb-1">
        <HardDrive class="h-4 w-4" />
        <span>Total Backups</span>
      </div>
      <p class="text-2xl font-semibold">{{ total }}</p>
    </div>

    <div class="rounded-lg border bg-card p-4">
      <div class="flex items-center gap-2 text-sm text-muted-foreground mb-1">
        <Clock class="h-4 w-4" />
        <span>Auto Backups</span>
      </div>
      <p class="text-2xl font-semibold">{{ auto }}</p>
    </div>

    <div class="rounded-lg border bg-card p-4">
      <div class="flex items-center gap-2 text-sm text-muted-foreground mb-1">
        <FileText class="h-4 w-4" />
        <span>Manual Backups</span>
      </div>
      <p class="text-2xl font-semibold">{{ manual }}</p>
    </div>

    <div class="rounded-lg border bg-card p-4">
      <div class="flex items-center gap-2 text-sm text-muted-foreground mb-1">
        <Settings class="h-4 w-4" />
        <span>Latest Backup</span>
      </div>
      <p class="text-2xl font-semibold">{{ latest }}</p>
    </div>
  </div>
</template>
