<script setup lang="ts">
import {
  useVueTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/vue-table'
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import type { Ticket } from '~/types/ticket'
import { Theme } from '~/enums'
import { DEFAULT_COLUMN_VISIBILITY, getColumnVisibility } from './types'
import { getButtonThemeStyles, getSelectThemeStyles } from './theme-styles'
import DesktopTable from './DesktopTable.vue'
import MobileTicketCard from './MobileTicketCard.vue'

interface Props {
  columns: ColumnDef<Ticket, unknown>[]
  data: Ticket[]
  theme?: Theme
}

const props = withDefaults(defineProps<Props>(), {
  theme: Theme.CHRISTMAS,
})

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>(DEFAULT_COLUMN_VISIBILITY)
const rowSelection = ref({})
const showDetails = ref(false)

const showReadyToRelease = ref(true)

// Initialize from localStorage on client side
onMounted(() => {
  if (import.meta.client) {
    const savedDetails = localStorage.getItem('showDetails')
    if (savedDetails) {
      const isVisible = JSON.parse(savedDetails)
      showDetails.value = isVisible
      columnVisibility.value = getColumnVisibility(isVisible)
    }

    const savedReadyToRelease = localStorage.getItem('showReadyToRelease')
    if (savedReadyToRelease) {
      showReadyToRelease.value = JSON.parse(savedReadyToRelease)
    }
  }
})

// Ready to release tickets (has release date)
const readyToReleaseTickets = computed(() => {
  return props.data.filter((t) => !!t.releaseDate)
})

// Regular tickets (exclude ready to release)
const regularTickets = computed(() => {
  return props.data.filter((t) => !t.releaseDate)
})

const toggleDetails = () => {
  const newVisibility = !showDetails.value
  showDetails.value = newVisibility
  if (import.meta.client) {
    localStorage.setItem('showDetails', JSON.stringify(newVisibility))
  }
  columnVisibility.value = getColumnVisibility(newVisibility)
}

const toggleReadyToRelease = () => {
  const newValue = !showReadyToRelease.value
  showReadyToRelease.value = newValue
  if (import.meta.client) {
    localStorage.setItem('showReadyToRelease', JSON.stringify(newValue))
  }
}

// Main table for regular tickets
const mainTable = useVueTable({
  get data() {
    return regularTickets.value
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  columnResizeMode: 'onChange',
  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
    get rowSelection() {
      return rowSelection.value
    },
  },
  onSortingChange: (updaterOrValue) => {
    sorting.value =
      typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue
  },
  onColumnFiltersChange: (updaterOrValue) => {
    columnFilters.value =
      typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters.value) : updaterOrValue
  },
  onColumnVisibilityChange: (updaterOrValue) => {
    columnVisibility.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(columnVisibility.value)
        : updaterOrValue
  },
  onRowSelectionChange: (updaterOrValue) => {
    rowSelection.value =
      typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection.value) : updaterOrValue
  },
})

// Ready to release table
const readyTable = useVueTable({
  get data() {
    return readyToReleaseTickets.value
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  columnResizeMode: 'onChange',
  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
  },
})

const selectStyles = computed(() => getSelectThemeStyles(props.theme))
</script>

<template>
  <div class="w-full h-full flex flex-col gap-3">
    <div class="flex-shrink-0 hidden sm:flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          :class="['h-9 px-3 border', getButtonThemeStyles(theme)]"
          :title="showDetails ? 'Hide Details' : 'Show Details'"
          @click="toggleDetails"
        >
          <ChevronDown v-if="showDetails" class="w-4 h-4 mr-1.5" />
          <ChevronRight v-else class="w-4 h-4 mr-1.5" />
          <span>{{ showDetails ? 'Hide' : 'Details' }}</span>
        </Button>
      </div>

      <slot name="actions" />
    </div>

    <!-- Mobile view -->
    <div class="flex-1 block sm:hidden overflow-auto pb-24">
      <div class="space-y-4 px-1">
        <template v-if="mainTable.getRowModel().rows?.length">
          <MobileTicketCard
            v-for="(row, index) in mainTable.getRowModel().rows"
            :key="row.id"
            :row="row"
            :index="index"
            :theme="theme"
          />
        </template>
        <div v-else class="text-center py-8 text-muted-foreground text-sm">No results.</div>
      </div>
    </div>

    <!-- Main table -->
    <DesktopTable :table="mainTable" :columns="columns" :theme="theme" />

    <!-- Ready to Release section -->
    <div class="mt-6">
      <Button
        variant="ghost"
        size="sm"
        :class="['h-9 px-3 mb-3 border', selectStyles.trigger]"
        @click="toggleReadyToRelease"
      >
        <ChevronDown v-if="showReadyToRelease" class="w-4 h-4 mr-1.5" />
        <ChevronRight v-else class="w-4 h-4 mr-1.5" />
        <CheckCircle2 class="w-4 h-4 mr-1.5" />
        <span>Ready to Release ({{ readyToReleaseTickets.length }})</span>
      </Button>

      <template v-if="showReadyToRelease">
        <!-- Mobile view for Ready to Release -->
        <div class="block sm:hidden">
          <div class="space-y-4 px-1">
            <template v-if="readyTable.getRowModel().rows?.length">
              <MobileTicketCard
                v-for="(row, index) in readyTable.getRowModel().rows"
                :key="row.id"
                :row="row"
                :index="index"
                :theme="theme"
              />
            </template>
            <div v-else class="text-center py-8 text-muted-foreground text-sm">
              No ready to release tickets.
            </div>
          </div>
        </div>
        <!-- Desktop view for Ready to Release -->
        <div class="hidden sm:block">
          <DesktopTable :table="readyTable" :columns="columns" :theme="theme" />
        </div>
      </template>
    </div>
  </div>
</template>
