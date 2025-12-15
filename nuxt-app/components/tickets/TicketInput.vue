<script setup lang="ts">
import { Gift } from 'lucide-vue-next'
import { Input } from '~/components/ui/input'

interface Props {
  ticketKey: string
  modelValue: string
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
})

const emit = defineEmits<Emits>()

const displayValue = computed(() => (props.modelValue === '--' ? '' : props.modelValue))

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value || '--')
}
</script>

<template>
  <div class="relative">
    <Input
      :key="ticketKey"
      :value="displayValue"
      :placeholder="placeholder"
      class="h-11 sm:h-8 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm sm:text-xs w-full sm:min-w-[250px] touch-manipulation rounded-lg focus:ring-2 focus:ring-white/30 pr-8"
      @input="handleChange"
    />
    <Gift
      class="w-3.5 h-3.5 text-white/40 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
    />
  </div>
</template>
