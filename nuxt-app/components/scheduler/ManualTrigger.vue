<script setup lang="ts">
import { Zap } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'

interface Props {
  triggering: boolean
}

interface Emits {
  (e: 'trigger'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <div class="border border-border rounded-lg p-6 bg-card">
    <h3 class="text-base font-semibold mb-2">Manual Trigger</h3>
    <p class="text-sm text-muted-foreground mb-4">
      Manually scan and reply to handover messages.
    </p>
    <Button
      :disabled="triggering"
      variant="outline"
      class="w-full"
      @click="$emit('trigger')"
    >
      <Zap class="w-4 h-4 mr-2" />
      {{ triggering ? 'Posting...' : 'Trigger Scheduled Comments' }}
    </Button>
  </div>
</template>
