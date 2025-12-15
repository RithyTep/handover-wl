<script setup lang="ts">
import type { Table as TanstackTable, ColumnDef } from '@tanstack/vue-table'
import { FlexRender } from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import type { Ticket } from '~/types/ticket'
import { Theme } from '~/enums'
import { getTableThemeStyles } from './theme-styles'

interface Props {
  table: TanstackTable<Ticket>
  columns: ColumnDef<Ticket, unknown>[]
  theme?: Theme
}

const props = withDefaults(defineProps<Props>(), {
  theme: Theme.DEFAULT,
})

const styles = computed(() => getTableThemeStyles(props.theme))
</script>

<template>
  <div :class="['overflow-hidden hidden sm:flex sm:flex-col', styles.container]">
    <div class="overflow-auto">
      <Table class="min-w-full md:min-w-[1400px]">
        <TableHeader :class="['sticky top-0 z-10', styles.header]">
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            :class="['hover:bg-transparent', styles.headerRow]"
          >
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              :class="['h-10 px-3 text-xs font-bold uppercase tracking-wide', styles.headerCell]"
              :style="{
                width: header.getSize() !== 150 ? `${header.getSize()}px` : undefined,
              }"
            >
              <template v-if="!header.isPlaceholder">
                <FlexRender
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </template>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody :class="styles.body">
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="(row, index) in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : undefined"
              :class="['transition-colors duration-150', styles.row(index)]"
            >
              <TableCell
                v-for="(cell, cellIndex) in row.getVisibleCells()"
                :key="cell.id"
                :class="['px-3 py-2', styles.cell(cellIndex)]"
                :style="{
                  width: cell.column.getSize() !== 150 ? `${cell.column.getSize()}px` : undefined,
                }"
              >
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <TableRow v-else>
            <TableCell :colspan="columns.length" :class="styles.emptyCell"> No results. </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
