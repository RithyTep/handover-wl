<script setup lang="ts">
import type { Ticket } from '~/types/ticket'

interface Props {
  ticket: Ticket
}

defineProps<Props>()
</script>

<template>
  <a
    :href="ticket.jiraUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="text-white hover:text-white/80 underline-offset-2 hover:underline font-medium text-xs whitespace-nowrap transition-colors"
  >
    {{ ticket.key }}
  </a>
</template>
