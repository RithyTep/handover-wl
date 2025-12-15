<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { cn } from '~/lib/utils'
import type { FeedbackType } from '~/enums'
import { feedbackTypes } from './feedback-types'

interface Props {
  selectedType: FeedbackType | null
}

interface Emits {
  (e: 'selectType', type: FeedbackType): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <Card class="mb-6">
    <CardHeader>
      <CardTitle class="text-lg">What type of feedback?</CardTitle>
      <CardDescription>Select the category that best fits your feedback</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="type in feedbackTypes"
          :key="type.id"
          type="button"
          :class="cn(
            'flex flex-col items-start p-4 rounded-lg border-2 transition-all text-left',
            selectedType === type.id
              ? type.color
              : 'border-border hover:border-muted-foreground/30 hover:bg-muted/50'
          )"
          :aria-pressed="selectedType === type.id"
          @click="$emit('selectType', type.id)"
        >
          <component
            :is="type.icon"
            :class="cn('w-5 h-5 mb-2', selectedType !== type.id && 'text-muted-foreground')"
          />
          <span class="font-medium text-sm">{{ type.label }}</span>
          <span class="text-xs text-muted-foreground mt-0.5">{{ type.description }}</span>
        </button>
      </div>
    </CardContent>
  </Card>
</template>
