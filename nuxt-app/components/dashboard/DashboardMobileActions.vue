<script setup lang="ts">
import { Theme } from '~/enums'
import { getMobileActionsConfig, getLayoutConfig } from '~/lib/theme'
import { cn } from '~/lib/utils'

interface Props {
  theme?: Theme
}

interface Emits {
  (e: 'aiFillAll'): void
  (e: 'quickFill'): void
  (e: 'clear'): void
  (e: 'save'): void
  (e: 'sendSlack'): void
}

const props = withDefaults(defineProps<Props>(), {
  theme: Theme.DEFAULT,
})

const emit = defineEmits<Emits>()

const mobileActionsConfig = computed(() => getMobileActionsConfig(props.theme))
const layoutConfig = computed(() => getLayoutConfig(props.theme))

interface MobileAction {
  config: {
    id: string
    icon?: unknown
    svgIcon?: string
    className: string
    iconColor: string
  }
  onClick: () => void
}

const actions = computed<MobileAction[]>(() => [
  { config: mobileActionsConfig.value.aiFill, onClick: () => emit('aiFillAll') },
  { config: mobileActionsConfig.value.quickFill, onClick: () => emit('quickFill') },
  { config: mobileActionsConfig.value.clear, onClick: () => emit('clear') },
  { config: mobileActionsConfig.value.save, onClick: () => emit('save') },
  { config: mobileActionsConfig.value.send, onClick: () => emit('sendSlack') },
])
</script>

<template>
  <div
    :class="
      cn(
        'fixed bottom-0 left-0 right-0 backdrop-blur-sm border-t px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:hidden z-50',
        layoutConfig.mobileBar
      )
    "
    role="toolbar"
    aria-label="Mobile actions"
  >
    <div class="flex items-center justify-around">
      <button
        v-for="action in actions"
        :key="action.config.id"
        :class="
          cn(
            'flex flex-col items-center justify-center min-w-[48px] min-h-[44px] rounded-xl transition-all active:scale-95',
            action.config.className,
            theme === 'christmas' && 'snow-btn'
          )
        "
        :aria-label="action.config.id.replace('-', ' ')"
        tabindex="0"
        @click="action.onClick"
      >
        <img
          v-if="action.config.svgIcon"
          :src="action.config.svgIcon"
          alt=""
          class="object-contain"
          width="40"
          height="40"
          style="image-rendering: pixelated"
        />
        <component
          :is="action.config.icon"
          v-else-if="action.config.icon"
          :class="cn('w-5 h-5', action.config.iconColor)"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>
