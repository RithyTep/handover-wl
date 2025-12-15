<script setup lang="ts">
import { MessageSquare, RefreshCw, Loader2, PlusCircle, Calendar } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'
import type { FeedbackItem } from './feedback-types'
import { getTypeConfig, formatDate } from './feedback-types'

interface Props {
  feedbackList: FeedbackItem[]
  isLoading: boolean
}

interface Emits {
  (e: 'refresh'): void
  (e: 'switchToSubmit'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <p class="text-sm text-muted-foreground">
        {{ feedbackList.length }} feedback submissions
      </p>
      <Button
        variant="ghost"
        size="sm"
        :disabled="isLoading"
        @click="$emit('refresh')"
      >
        <RefreshCw :class="cn('w-4 h-4 mr-2', isLoading && 'animate-spin')" />
        Refresh
      </Button>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="w-6 h-6 animate-spin text-muted-foreground" />
    </div>

    <Card v-else-if="feedbackList.length === 0" class="border-dashed">
      <CardContent class="py-12 text-center">
        <MessageSquare class="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
        <p class="text-muted-foreground">No feedback yet. Be the first to share!</p>
        <Button
          variant="outline"
          size="sm"
          class="mt-4"
          @click="$emit('switchToSubmit')"
        >
          <PlusCircle class="w-4 h-4 mr-2" />
          Submit Feedback
        </Button>
      </CardContent>
    </Card>

    <div v-else class="space-y-4">
      <Card v-for="item in feedbackList" :key="item.id">
        <CardHeader class="pb-3">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3 flex-1 min-w-0">
              <div
                :class="cn(
                  'p-2 rounded-lg shrink-0',
                  getTypeConfig(item.type).color.split(' ').slice(1).join(' ')
                )"
              >
                <component
                  :is="getTypeConfig(item.type).icon"
                  :class="cn('w-4 h-4', getTypeConfig(item.type).color.split(' ')[0])"
                />
              </div>
              <div class="flex-1 min-w-0">
                <CardTitle class="text-base truncate">{{ item.title }}</CardTitle>
                <div class="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    :class="cn('text-xs', getTypeConfig(item.type).color)"
                  >
                    {{ getTypeConfig(item.type).label }}
                  </Badge>
                  <span class="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar class="w-3 h-3" />
                    {{ formatDate(item.created_at) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground whitespace-pre-wrap">{{ item.description }}</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
