import type { VisibilityState } from '@tanstack/vue-table'
import type { Theme } from '~/enums'
import type { Ticket } from '~/types/ticket'

export type { Ticket }

export interface TicketsTableProps {
  data: Ticket[]
  theme?: Theme
}

export interface FilterOptions {
  assignees: string[]
  statuses: string[]
  mainTypes: string[]
  subTypes: string[]
  customerLevels: string[]
}

export interface TicketFilters {
  assignee: string | null
  status: string | null
  mainType: string | null
  subType: string | null
  customerLevel: string | null
}

export const DEFAULT_COLUMN_VISIBILITY: VisibilityState = {
  assignee: true,
  created: false,
  dueDate: false,
  status: false,
  wlMainTicketType: false,
  wlSubTicketType: false,
  customerLevel: false,
}

export function getColumnVisibility(showDetails: boolean): VisibilityState {
  return {
    assignee: true,
    created: showDetails,
    dueDate: showDetails,
    status: showDetails,
    wlMainTicketType: showDetails,
    wlSubTicketType: showDetails,
    customerLevel: showDetails,
  }
}
