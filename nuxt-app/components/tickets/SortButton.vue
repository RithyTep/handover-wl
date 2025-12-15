<script setup lang="ts">
import { ArrowUpDown } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'

interface Props {
  label: string
  isSorted: false | 'asc' | 'desc'
}

interface Emits {
  (e: 'click'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <Button
    variant="ghost"
    class="h-auto p-0 hover:bg-transparent text-xs font-medium text-white/90 hover:text-white"
    @click="$emit('click')"
  >
    {{ label }}
    <ArrowUpDown class="ml-1.5 h-3 w-3" />
  </Button>
</template>
