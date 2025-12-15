import type { ColumnDef } from '@tanstack/vue-table'
import type { Ticket } from '~/types/ticket'
import { h } from 'vue'
import TicketLink from './TicketLink.vue'
import TicketInput from './TicketInput.vue'
import SortButton from './SortButton.vue'
import AssigneeCell from './AssigneeCell.vue'

interface ColumnsProps {
  ticketData: Record<string, string>
  updateTicketData: (key: string, value: string) => void
  renderKey: number
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString()
}

export const createColumns = ({
  ticketData,
  updateTicketData,
  renderKey,
}: ColumnsProps): ColumnDef<Ticket>[] => [
  {
    accessorKey: 'index',
    header: () => h('span', { class: 'hidden sm:inline' }, '#'),
    enableHiding: false,
    cell: ({ row }) =>
      h('div', { class: 'text-white/70 font-medium text-xs hidden sm:block' }, row.index + 1),
  },
  {
    accessorKey: 'key',
    enableHiding: false,
    header: ({ column }) =>
      h(SortButton, {
        label: 'Ticket',
        isSorted: column.getIsSorted(),
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }),
    cell: ({ row }) => h(TicketLink, { ticket: row.original }),
  },
  {
    accessorKey: 'summary',
    header: 'Summary',
    enableHiding: false,
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-xs text-white line-clamp-2 sm:truncate sm:max-w-md' },
        row.getValue('summary')
      ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) =>
      h('div', { class: 'text-xs text-white/70 whitespace-nowrap' }, row.getValue('status')),
  },
  {
    accessorKey: 'assignee',
    header: 'Assignee',
    cell: ({ row }) =>
      h(AssigneeCell, {
        assignee: row.getValue('assignee') as string,
        assigneeAvatar: row.original.assigneeAvatar,
      }),
  },
  {
    accessorKey: 'created',
    header: ({ column }) =>
      h(SortButton, {
        label: 'Created',
        isSorted: column.getIsSorted(),
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }),
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-xs text-white/70 whitespace-nowrap' },
        formatDate(row.getValue('created'))
      ),
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) =>
      h(SortButton, {
        label: 'Due Date',
        isSorted: column.getIsSorted(),
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }),
    cell: ({ row }) => {
      const dueDate = row.getValue('dueDate') as string | null
      return h(
        'div',
        { class: 'text-xs text-white/70 whitespace-nowrap' },
        dueDate ? formatDate(dueDate) : '—'
      )
    },
  },
  {
    accessorKey: 'wlMainTicketType',
    header: () => h('div', { class: 'whitespace-nowrap' }, 'WL Main Type'),
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-xs text-white/70 whitespace-nowrap' },
        row.getValue('wlMainTicketType')
      ),
  },
  {
    accessorKey: 'wlSubTicketType',
    header: () => h('div', { class: 'whitespace-nowrap' }, 'WL Sub Type'),
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-xs text-white/70 whitespace-nowrap' },
        row.getValue('wlSubTicketType')
      ),
  },
  {
    accessorKey: 'customerLevel',
    header: ({ column }) =>
      h(SortButton, {
        label: 'Customer Level',
        isSorted: column.getIsSorted(),
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }),
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-xs text-white/70 whitespace-nowrap' },
        row.getValue('customerLevel')
      ),
  },
  {
    accessorKey: 'savedStatus',
    header: 'Status',
    enableHiding: false,
    cell: ({ row }) =>
      h(TicketInput, {
        ticketKey: `status-${row.original.key}-${renderKey}`,
        modelValue: ticketData[`status-${row.original.key}`] ?? row.original.savedStatus,
        placeholder: 'Enter status...',
        'onUpdate:modelValue': (value: string) =>
          updateTicketData(`status-${row.original.key}`, value),
      }),
  },
  {
    accessorKey: 'savedAction',
    header: 'Action',
    enableHiding: false,
    cell: ({ row }) =>
      h(TicketInput, {
        ticketKey: `action-${row.original.key}-${renderKey}`,
        modelValue: ticketData[`action-${row.original.key}`] ?? row.original.savedAction,
        placeholder: 'Enter action...',
        'onUpdate:modelValue': (value: string) =>
          updateTicketData(`action-${row.original.key}`, value),
      }),
  },
]
