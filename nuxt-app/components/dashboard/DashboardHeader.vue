<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Theme } from '~/enums'
import { getHeaderConfig, getHeaderNavItems, getKbdIcon } from '~/lib/theme'

interface Props {
  theme?: Theme
  ticketCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  theme: Theme.DEFAULT,
  ticketCount: 0,
})

const config = computed(() => getHeaderConfig(props.theme))
const navItems = computed(() => getHeaderNavItems(props.theme))
const kbdConfig = computed(() => getKbdIcon(props.theme))
</script>

<template>
  <header :class="config.container">
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-3">
        <div class="flex flex-col">
          <h1 :class="config.logo.title">Handover</h1>
          <span v-if="config.logo.subtitle" :class="config.logo.subtitle">Task Management</span>
        </div>
      </div>
      <div class="hidden sm:flex items-center gap-2">
        <span class="h-5 w-px bg-slate-700" aria-hidden="true" />
        <span :class="config.badge">{{ ticketCount }} tickets</span>
      </div>
    </div>

    <nav class="flex items-center gap-2" aria-label="Main navigation">
      <slot name="theme-selector" />
      <NuxtLink v-for="item in navItems" :key="item.href" :to="item.href">
        <Button variant="ghost" size="sm" :class="config.nav.link" :aria-label="item.label">
          <component
            :is="item.icon"
            v-if="item.icon"
            class="w-4 h-4 mr-1.5"
            aria-hidden="true"
          />
          <span class="hidden sm:inline">{{ item.label }}</span>
        </Button>
      </NuxtLink>
      <kbd :class="config.nav.kbd" aria-label="Press Command + K for quick actions">
        <component
          :is="kbdConfig.icon"
          v-if="kbdConfig.icon"
          class="w-3 h-3"
          aria-hidden="true"
        />
        <span>K</span>
      </kbd>
    </nav>
  </header>
</template>
