<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Theme } from '~/enums'
import { getActionsConfig } from '~/lib/theme'
import { cn } from '~/lib/utils'

interface Props {
  theme?: Theme
}

interface Emits {
  (e: 'aiFillAll'): void
  (e: 'quickFill'): void
  (e: 'clear'): void
  (e: 'refresh'): void
  (e: 'copy'): void
  (e: 'save'): void
  (e: 'sendSlack'): void
}

const props = withDefaults(defineProps<Props>(), {
  theme: Theme.DEFAULT,
})

const emit = defineEmits<Emits>()

const actionsConfig = computed(() => getActionsConfig(props.theme))

const handleQuickFill = () => {
  emit('quickFill')
}

interface ActionItem {
  config: {
    id: string
    label: string
    svgIcon?: string
    icon?: unknown
    className: string
    iconClassName?: string
  }
  onClick: () => void
  variant?: 'ghost' | 'outline' | 'default'
  showDividerAfter?: boolean
}

const actions = computed<ActionItem[]>(() => [
  { config: actionsConfig.value.aiFill, onClick: () => emit('aiFillAll') },
  { config: actionsConfig.value.quickFill, onClick: handleQuickFill },
  { config: actionsConfig.value.clear, onClick: () => emit('clear') },
  {
    config: actionsConfig.value.refresh,
    onClick: () => emit('refresh'),
    showDividerAfter: props.theme === 'pixel' || props.theme === 'coding',
  },
  { config: actionsConfig.value.copy, onClick: () => emit('copy') },
  {
    config: actionsConfig.value.save,
    onClick: () => emit('save'),
    variant: props.theme === 'default' ? 'outline' : 'ghost',
  },
  {
    config: actionsConfig.value.send,
    onClick: () => emit('sendSlack'),
    variant: props.theme === 'default' || props.theme === 'christmas' ? 'default' : 'ghost',
  },
])
</script>

<template>
  <div
    :class="cn('hidden sm:flex items-center pt-2', theme === 'default' ? 'gap-2' : 'gap-3')"
    role="toolbar"
    aria-label="Dashboard actions"
  >
    <template v-for="action in actions" :key="action.config.id">
      <Button
        :variant="(action.variant as 'ghost' | 'outline' | 'default') || 'ghost'"
        size="sm"
        :class="action.config.className"
        :aria-label="action.config.label"
        @click="action.onClick"
      >
        <img
          v-if="action.config.svgIcon"
          :src="action.config.svgIcon"
          alt=""
          :class="cn('w-4 h-4 mr-1.5', action.config.iconClassName)"
          aria-hidden="true"
        />
        <component
          :is="action.config.icon"
          v-else-if="action.config.icon"
          :class="cn('w-3.5 h-3.5 mr-1.5', action.config.iconClassName)"
        />
        <span>{{ action.config.label }}</span>
      </Button>
      <div
        v-if="action.showDividerAfter"
        :class="cn('h-6 mx-1', theme === 'coding' ? 'w-px bg-zinc-700' : 'w-0.5 bg-slate-800')"
        aria-hidden="true"
      />
    </template>
  </div>
</template>
