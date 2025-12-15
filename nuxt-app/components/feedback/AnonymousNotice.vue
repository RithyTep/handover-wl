<script setup lang="ts">
import { Star } from 'lucide-vue-next'
import { Card, CardContent } from '~/components/ui/card'
</script>

<template>
  <Card class="mb-6 border-muted bg-muted/30">
    <CardContent class="py-4">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Star class="w-4 h-4 text-primary" />
        </div>
        <div>
          <p class="text-sm font-medium">Anonymous Submission</p>
          <p class="text-xs text-muted-foreground mt-0.5">
            Your feedback is completely anonymous. No personal information is collected or stored.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
