<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import { FlexRender } from '@tanstack/vue-table'
import type { Ticket } from '~/types/ticket'
import { Theme } from '~/enums'
import { getMobileCardThemeStyle, getChristmasRowClass } from './theme-styles'

interface Props {
  row: Row<Ticket>
  index: number
  theme?: Theme
}

const props = withDefaults(defineProps<Props>(), {
  theme: Theme.DEFAULT,
})

const ticket = computed(() => props.row.original)

const cardClass = computed(() => {
  return props.theme === 'christmas' ? getChristmasRowClass(props.index) : ''
})

const statusCell = computed(() => {
  return props.row
    .getVisibleCells()
    .find((cell) => cell.column.id === 'savedStatus')
})

const actionCell = computed(() => {
  return props.row
    .getVisibleCells()
    .find((cell) => cell.column.id === 'savedAction')
})
</script>

<template>
  <div
    :class="[
      'border rounded-lg overflow-hidden shadow-sm',
      getMobileCardThemeStyle('card', theme),
      cardClass,
    ]"
  >
    <div
      :class="[
        'flex items-center justify-between px-4 py-3 border-b',
        getMobileCardThemeStyle('header', theme),
      ]"
    >
      <div class="flex items-center gap-2.5">
        <span
          :class="[
            'text-[11px] font-medium tabular-nums',
            getMobileCardThemeStyle('indexNumber', theme),
          ]"
        >
          {{ index + 1 }}
        </span>
        <a
          :href="ticket.jiraUrl"
          target="_blank"
          rel="noopener noreferrer"
          :class="[
            'text-sm font-semibold transition-colors',
            getMobileCardThemeStyle('ticketLink', theme),
          ]"
        >
          {{ ticket.key }}
        </a>
      </div>
      <div class="flex items-center gap-2">
        <img
          v-if="ticket.assigneeAvatar"
          :src="ticket.assigneeAvatar"
          :alt="ticket.assignee"
          :class="['w-5 h-5 rounded-full ring-1', getMobileCardThemeStyle('avatarRing', theme)]"
        />
        <div
          v-else
          :class="[
            'w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium',
            getMobileCardThemeStyle('avatarPlaceholder', theme),
          ]"
        >
          {{ ticket.assignee === 'Unassigned' ? '?' : ticket.assignee.charAt(0).toUpperCase() }}
        </div>
      </div>
    </div>

    <div class="p-4 space-y-4">
      <p
        :class="[
          'text-[13px] leading-relaxed line-clamp-2',
          getMobileCardThemeStyle('summary', theme),
        ]"
      >
        {{ ticket.summary }}
      </p>

      <div class="space-y-3">
        <div>
          <label
            :class="[
              'text-[10px] font-medium uppercase tracking-wider mb-1.5 block',
              getMobileCardThemeStyle('label', theme),
            ]"
          >
            Status
          </label>
          <div v-if="statusCell">
            <FlexRender
              :render="statusCell.column.columnDef.cell"
              :props="statusCell.getContext()"
            />
          </div>
        </div>
        <div>
          <label
            :class="[
              'text-[10px] font-medium uppercase tracking-wider mb-1.5 block',
              getMobileCardThemeStyle('label', theme),
            ]"
          >
            Action
          </label>
          <div v-if="actionCell">
            <FlexRender
              :render="actionCell.column.columnDef.cell"
              :props="actionCell.getContext()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
