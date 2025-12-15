<script setup lang="ts">
import { Send, Loader2 } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { FeedbackType } from '~/enums'
import FeedbackTypeSelector from './FeedbackTypeSelector.vue'
import FeedbackDetailsCard from './FeedbackDetailsCard.vue'
import AnonymousNotice from './AnonymousNotice.vue'

interface Emits {
  (e: 'success'): void
}

const emit = defineEmits<Emits>()
const { $toast } = useNuxtApp()

const selectedType = ref<FeedbackType | null>(null)
const title = ref('')
const description = ref('')
const isSubmitting = ref(false)

const isValid = computed(() => selectedType.value && title.value.trim() && description.value.trim())

const handleSubmit = async () => {
  if (!selectedType.value || !title.value.trim() || !description.value.trim()) {
    $toast?.error('Please fill in all required fields')
    return
  }

  isSubmitting.value = true

  try {
    await $fetch('/api/feedback', {
      method: 'POST',
      body: {
        type: selectedType.value,
        title: title.value.trim(),
        description: description.value.trim(),
      },
    })

    $toast?.success('Thank you for your feedback!')
    emit('success')
  } catch (e) {
    $toast?.error((e as Error).message || 'Failed to submit feedback')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <FeedbackTypeSelector
      :selected-type="selectedType"
      @select-type="selectedType = $event"
    />
    <FeedbackDetailsCard
      v-model:title="title"
      v-model:description="description"
      :selected-type="selectedType"
    />
    <AnonymousNotice />
    <Button
      type="submit"
      size="lg"
      class="w-full"
      :disabled="!isValid || isSubmitting"
    >
      <template v-if="isSubmitting">
        <Loader2 class="w-4 h-4 mr-2 animate-spin" />
        Submitting...
      </template>
      <template v-else>
        <Send class="w-4 h-4 mr-2" />
        Submit Feedback
      </template>
    </Button>
  </form>
</template>
