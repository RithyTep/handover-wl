<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import type { FeedbackType } from '~/enums'

interface Props {
  selectedType: FeedbackType | null
}

defineProps<Props>()

const title = defineModel<string>('title', { default: '' })
const description = defineModel<string>('description', { default: '' })

function getPlaceholder(type: FeedbackType | null): string {
  if (type === 'bug') {
    return 'Please describe the issue, steps to reproduce, and expected behavior...'
  }
  if (type === 'feature') {
    return "Describe the feature you'd like to see and how it would help..."
  }
  return 'Share your thoughts, ideas, or suggestions...'
}
</script>

<template>
  <Card class="mb-6">
    <CardHeader>
      <CardTitle class="text-lg">Details</CardTitle>
      <CardDescription>
        Provide as much detail as possible to help us understand your feedback
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="space-y-2">
        <Label for="title">
          Title <span class="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          v-model="title"
          placeholder="Brief summary of your feedback"
          :maxlength="200"
        />
        <p class="text-xs text-muted-foreground text-right">{{ title.length }}/200</p>
      </div>

      <div class="space-y-2">
        <Label for="description">
          Description <span class="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          v-model="description"
          :placeholder="getPlaceholder(selectedType)"
          :rows="6"
          :maxlength="2000"
        />
        <p class="text-xs text-muted-foreground text-right">{{ description.length }}/2000</p>
      </div>
    </CardContent>
  </Card>
</template>
