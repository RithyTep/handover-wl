<script setup lang="ts">
import { Sun, Moon, Key, AtSign } from 'lucide-vue-next'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

interface Props {
  variant: 'evening' | 'night'
}

const props = defineProps<Props>()

const token = defineModel<string>('token', { default: '' })
const mentions = defineModel<string>('mentions', { default: '' })

const isEvening = computed(() => props.variant === 'evening')
const Icon = computed(() => (isEvening.value ? Sun : Moon))
const iconColor = computed(() => (isEvening.value ? 'text-orange-500' : 'text-blue-500'))
const title = computed(() => (isEvening.value ? 'Evening Shift' : 'Night Shift'))
const tokenId = computed(() => (isEvening.value ? 'eveningToken' : 'nightToken'))
const mentionsId = computed(() => (isEvening.value ? 'eveningMentions' : 'nightMentions'))
const tokenLabel = computed(() => (isEvening.value ? 'Evening User Token' : 'Night User Token'))
const mentionsLabel = computed(() => (isEvening.value ? 'Evening Mentions' : 'Night Mentions'))
const tokenDesc = computed(() =>
  isEvening.value
    ? 'Slack user token for evening report. Leave empty to disable evening report.'
    : 'Slack user token for night report. Leave empty to disable night report.'
)
const mentionsDesc = computed(() =>
  isEvening.value
    ? 'Member mentions for evening shift handover'
    : 'Member mentions for night shift handover'
)
</script>

<template>
  <div class="border border-border rounded-lg p-6 bg-card">
    <div class="flex items-center gap-2 mb-4">
      <component :is="Icon" :class="['w-4 h-4', iconColor]" />
      <h3 class="text-base font-semibold">{{ title }}</h3>
    </div>

    <div class="space-y-4">
      <div>
        <Label :for="tokenId" class="text-sm font-medium mb-2 block">
          <Key class="w-3 h-3 inline mr-1" />
          {{ tokenLabel }}
        </Label>
        <Input
          :id="tokenId"
          v-model="token"
          type="password"
          placeholder="xoxp-..."
          class="w-full font-mono"
        />
        <p class="text-xs text-muted-foreground mt-1">{{ tokenDesc }}</p>
      </div>

      <div>
        <Label :for="mentionsId" class="text-sm font-medium mb-2 block">
          <AtSign class="w-3 h-3 inline mr-1" />
          {{ mentionsLabel }}
        </Label>
        <Input
          :id="mentionsId"
          v-model="mentions"
          type="text"
          placeholder="<@U123456> <@U789012> or @channel"
          class="w-full"
        />
        <p class="text-xs text-muted-foreground mt-1">{{ mentionsDesc }}</p>
      </div>
    </div>
  </div>
</template>
