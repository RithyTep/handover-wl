<script setup lang="ts">
import { Hash, Save } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

interface Emits {
  (e: 'save'): void
}

defineEmits<Emits>()

const channelId = defineModel<string>('channelId', { default: '' })
</script>

<template>
  <div class="border border-border rounded-lg p-6 bg-card">
    <div class="flex items-center gap-2 mb-4">
      <Hash class="w-4 h-4 text-muted-foreground" />
      <h3 class="text-base font-semibold">Slack Channel</h3>
    </div>

    <div class="space-y-4">
      <div>
        <Label for="channelId" class="text-sm font-medium mb-2 block">
          Custom Channel ID
        </Label>
        <Input
          id="channelId"
          v-model="channelId"
          type="text"
          placeholder="C08TWKP6ZK7"
          class="w-full font-mono"
        />
        <p class="text-xs text-muted-foreground mt-1">
          Leave empty to use default channel from environment variables
        </p>
      </div>

      <Button
        variant="default"
        size="sm"
        class="w-full sm:w-auto"
        @click="$emit('save')"
      >
        <Save class="w-4 h-4 mr-2" />
        Save Channel ID
      </Button>
    </div>
  </div>
</template>
