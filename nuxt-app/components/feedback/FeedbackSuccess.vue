<script setup lang="ts">
import { Check, List, ArrowLeft } from 'lucide-vue-next'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

interface Emits {
  (e: 'submitAnother'): void
  (e: 'viewAll'): void
}

defineEmits<Emits>()
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="max-w-2xl mx-auto px-4 py-8">
      <Card class="border-green-500/20 bg-green-500/5">
        <CardContent class="pt-8 pb-8 text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center"
          >
            <Check class="w-8 h-8 text-green-500" />
          </div>
          <h2 class="text-2xl font-semibold mb-2">Thank You!</h2>
          <p class="text-muted-foreground mb-6">
            Your feedback has been submitted anonymously. We appreciate your input!
          </p>
          <div class="flex gap-3 justify-center">
            <Button variant="outline" @click="$emit('submitAnother')">
              Submit Another
            </Button>
            <Button variant="outline" @click="$emit('viewAll')">
              <List class="w-4 h-4 mr-2" />
              View All Feedback
            </Button>
            <NuxtLink to="/">
              <Button>
                <ArrowLeft class="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </NuxtLink>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
