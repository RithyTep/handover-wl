<script setup lang="ts">
import { ArrowLeft, PlusCircle, List } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import {
  FeedbackForm,
  FeedbackList,
  FeedbackSuccess,
  type FeedbackItem,
} from '~/components/feedback'

useHead({
  title: 'Feedback - Jira Handover',
  meta: [
    { name: 'description', content: 'Submit anonymous feedback, suggestions, bug reports, or feature requests' },
  ],
})

const activeTab = ref<'submit' | 'view'>('submit')
const isSubmitted = ref(false)
const feedbackList = ref<FeedbackItem[]>([])
const isLoading = ref(false)

const fetchFeedback = async () => {
  if (activeTab.value !== 'view') return

  isLoading.value = true
  try {
    const response = await $fetch<{ feedback: FeedbackItem[] }>('/api/feedback')
    feedbackList.value = response.feedback
  } catch (e) {
    console.error('Failed to fetch feedback:', e)
  } finally {
    isLoading.value = false
  }
}

watch(activeTab, (newTab) => {
  if (newTab === 'view') {
    fetchFeedback()
  }
})

const handleSuccess = () => {
  isSubmitted.value = true
  fetchFeedback()
}

const handleReset = () => {
  isSubmitted.value = false
}

const handleViewAll = () => {
  isSubmitted.value = false
  activeTab.value = 'view'
}
</script>

<template>
  <FeedbackSuccess
    v-if="isSubmitted"
    @submit-another="handleReset"
    @view-all="handleViewAll"
  />

  <div v-else class="min-h-screen bg-background">
    <div class="max-w-3xl mx-auto px-4 py-8">
      <div class="mb-6">
        <NuxtLink to="/">
          <Button
            variant="ghost"
            size="sm"
            class="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft class="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </NuxtLink>
        <h1 class="text-3xl font-bold tracking-tight">Feedback</h1>
        <p class="text-muted-foreground mt-2">
          Share your thoughts anonymously. All feedback is welcome!
        </p>
      </div>

      <div class="flex gap-2 mb-6">
        <Button
          :variant="activeTab === 'submit' ? 'default' : 'outline'"
          size="sm"
          @click="activeTab = 'submit'"
        >
          <PlusCircle class="w-4 h-4 mr-2" />
          Submit Feedback
        </Button>
        <Button
          :variant="activeTab === 'view' ? 'default' : 'outline'"
          size="sm"
          @click="activeTab = 'view'"
        >
          <List class="w-4 h-4 mr-2" />
          View All ({{ feedbackList.length }})
        </Button>
      </div>

      <FeedbackList
        v-if="activeTab === 'view'"
        :feedback-list="feedbackList"
        :is-loading="isLoading"
        @refresh="fetchFeedback"
        @switch-to-submit="activeTab = 'submit'"
      />
      <FeedbackForm v-else @success="handleSuccess" />
    </div>
  </div>
</template>
