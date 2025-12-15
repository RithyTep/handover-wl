<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
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
  (e: 'quickFill', status: string, action: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const status = ref('Pending')
const action = ref('Will check tomorrow')

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

const handleConfirm = () => {
  emit('quickFill', status.value, action.value)
  isOpen.value = false
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Quick Fill All Tickets</DialogTitle>
        <DialogDescription> Fill all tickets with the same status and action. </DialogDescription>
      </DialogHeader>
      <div class="space-y-4 mt-4">
        <div>
          <label
            for="quick-fill-status"
            class="text-sm font-semibold mb-2 block text-muted-foreground uppercase tracking-wide"
          >
            Status
          </label>
          <Input
            id="quick-fill-status"
            v-model="status"
            type="text"
            placeholder="Enter status..."
            class="h-11 sm:h-10 text-base sm:text-sm"
            aria-describedby="quick-fill-description"
          />
        </div>
        <div>
          <label
            for="quick-fill-action"
            class="text-sm font-semibold mb-2 block text-muted-foreground uppercase tracking-wide"
          >
            Action
          </label>
          <Input
            id="quick-fill-action"
            v-model="action"
            type="text"
            placeholder="Enter action..."
            class="h-11 sm:h-10 text-base sm:text-sm"
            aria-describedby="quick-fill-description"
          />
        </div>
      </div>
      <DialogFooter class="flex-col sm:flex-row gap-2 mt-4">
        <Button variant="outline" class="h-11 sm:h-10 w-full sm:w-auto" @click="isOpen = false">
          Cancel
        </Button>
        <Button class="h-11 sm:h-10 w-full sm:w-auto" @click="handleConfirm"> Apply to all </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
