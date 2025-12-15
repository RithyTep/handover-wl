<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog'

interface Props {
  open: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'clearAll'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

const handleClearAll = () => {
  emit('clearAll')
  isOpen.value = false
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <div
          class="w-14 h-14 sm:w-12 sm:h-12 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center mx-auto mb-4"
        >
          <AlertTriangle class="w-7 h-7 sm:w-6 sm:h-6" />
        </div>
        <DialogTitle class="text-center text-lg">Clear all fields?</DialogTitle>
        <DialogDescription class="text-center text-sm">
          This will clear all status and action fields. This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="flex-col sm:flex-row gap-2 mt-4">
        <Button variant="outline" class="h-11 sm:h-10 w-full sm:w-auto" @click="isOpen = false">
          Cancel
        </Button>
        <Button variant="destructive" class="h-11 sm:h-10 w-full sm:w-auto" @click="handleClearAll">
          Clear all
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
