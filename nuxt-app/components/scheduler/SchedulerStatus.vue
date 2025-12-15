<script setup lang="ts">
import { Clock, CheckCircle2, XCircle, Bell } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'

interface Props {
  enabled: boolean
  loading: boolean
}

interface Emits {
  (e: 'toggle'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <div class="border border-border rounded-lg p-6 bg-card">
    <div class="flex items-start justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Clock class="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h3 class="text-base font-semibold mb-1">Auto-send Status</h3>
          <Badge :variant="enabled ? 'default' : 'secondary'" class="text-xs">
            <template v-if="enabled">
              <CheckCircle2 class="w-3 h-3 mr-1" />
              Enabled
            </template>
            <template v-else>
              <XCircle class="w-3 h-3 mr-1" />
              Disabled
            </template>
          </Badge>
        </div>
      </div>
      <Button
        :variant="enabled ? 'destructive' : 'default'"
        size="sm"
        :disabled="loading"
        @click="$emit('toggle')"
      >
        {{ enabled ? 'Disable' : 'Enable' }}
      </Button>
    </div>

    <div v-if="enabled" class="p-3 bg-muted/50 rounded-md border border-border/50">
      <div class="flex items-start gap-2">
        <Bell class="w-4 h-4 text-muted-foreground mt-0.5" />
        <div>
          <p class="text-sm font-medium mb-1">Active</p>
          <p class="text-xs text-muted-foreground">
            Reports will be sent based on shift configuration. Only shifts with valid user tokens will trigger.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
