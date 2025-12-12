import { useMemo } from "react"
import type { Ticket, TicketFilters, FilterOptions } from "./ticket-table-types"

export function useTicketFilters<TData>(
	data: TData[],
	activeFilters: TicketFilters
): { filterOptions: FilterOptions; filteredData: Ticket[] } {
	const filterOptions = useMemo(() => {
		const ticketsData = data as Ticket[]
		return {
			assignees: Array.from(new Set(ticketsData.map((t) => t.assignee)))
				.filter(Boolean)
				.sort(),
			statuses: Array.from(new Set(ticketsData.map((t) => t.status)))
				.filter(Boolean)
				.sort(),
			mainTypes: Array.from(new Set(ticketsData.map((t) => t.wlMainTicketType)))
				.filter((v) => v && v !== "N/A")
				.sort(),
			subTypes: Array.from(new Set(ticketsData.map((t) => t.wlSubTicketType)))
				.filter((v) => v && v !== "N/A")
				.sort(),
			customerLevels: Array.from(
				new Set(ticketsData.map((t) => t.customerLevel))
			)
				.filter((v) => v && v !== "N/A")
				.sort(),
		}
	}, [data])

	const filteredData = useMemo(() => {
		const ticketsData = data as Ticket[]

		return ticketsData.filter((ticket) => {
			if (
				activeFilters.assignee &&
				ticket.assignee !== activeFilters.assignee
			) {
				return false
			}

			if (activeFilters.status && ticket.status !== activeFilters.status) {
				return false
			}

			if (
				activeFilters.wlMainTicketType &&
				ticket.wlMainTicketType !== activeFilters.wlMainTicketType
			) {
				return false
			}

			if (
				activeFilters.wlSubTicketType &&
				ticket.wlSubTicketType !== activeFilters.wlSubTicketType
			) {
				return false
			}

			if (
				activeFilters.customerLevel &&
				ticket.customerLevel !== activeFilters.customerLevel
			) {
				return false
			}

			if (activeFilters.dateFrom) {
				const ticketDate = new Date(ticket.created)
				const fromDate = new Date(activeFilters.dateFrom)
				if (ticketDate < fromDate) {
					return false
				}
			}

			if (activeFilters.dateTo) {
				const ticketDate = new Date(ticket.created)
				const toDate = new Date(activeFilters.dateTo)
				toDate.setHours(23, 59, 59, 999)
				if (ticketDate > toDate) {
					return false
				}
			}

			if (activeFilters.jqlQuery) {
				const query = activeFilters.jqlQuery.toLowerCase()
				const searchText =
					`${ticket.key} ${ticket.summary} ${ticket.status} ${ticket.assignee}`.toLowerCase()
				if (!searchText.includes(query)) {
					return false
				}
			}

			return true
		})
	}, [data, activeFilters])

	return { filterOptions, filteredData }
}
