import type { ColumnDef, VisibilityState } from "@tanstack/react-table"
import type { Theme } from "@/enums"
import type { Ticket } from "@/lib/types"
import type { TicketFilters } from "@/components/filters"

export type { Ticket, TicketFilters }
export { Theme }

export interface TicketsTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	actionButtons?: React.ReactNode
	theme?: Theme
}

export interface FilterOptions {
	assignees: string[]
	statuses: string[]
	mainTypes: string[]
	subTypes: string[]
	customerLevels: string[]
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
