import { useMemo } from "react"
import type { Ticket, TicketFilters, FilterOptions } from "./ticket-table-types"
import type { TicketStatusFilter } from "@/components/filters"

function extractUniqueValues<T>(items: T[], extractor: (item: T) => string | undefined): string[] {
	return Array.from(new Set(items.map(extractor)))
		.filter((v): v is string => Boolean(v) && v !== "N/A")
		.sort()
}

function buildFilterOptions(tickets: Ticket[]): FilterOptions {
	return {
		assignees: extractUniqueValues(tickets, (t) => t.assignee),
		statuses: extractUniqueValues(tickets, (t) => t.status),
		mainTypes: extractUniqueValues(tickets, (t) => t.wlMainTicketType),
		subTypes: extractUniqueValues(tickets, (t) => t.wlSubTicketType),
		customerLevels: extractUniqueValues(tickets, (t) => t.customerLevel),
	}
}

function matchesStringFilter(value: string | undefined, filter: string | undefined): boolean {
	return !filter || value === filter
}

function matchesTicketStatus(ticket: Ticket, ticketStatus: TicketStatusFilter | undefined): boolean {
	if (!ticketStatus || ticketStatus === "all") return true

	if (ticketStatus === "pending") {
		return ticket.status === "WL - Pending"
	}

	if (ticketStatus === "ready_to_release") {
		return !!ticket.releaseDate
	}

	return true
}

function matchesDateFrom(ticketDate: string, dateFrom: string | undefined): boolean {
	if (!dateFrom) return true
	return new Date(ticketDate) >= new Date(dateFrom)
}

function matchesDateTo(ticketDate: string, dateTo: string | undefined): boolean {
	if (!dateTo) return true
	const toDate = new Date(dateTo)
	toDate.setHours(23, 59, 59, 999)
	return new Date(ticketDate) <= toDate
}

function matchesJqlQuery(ticket: Ticket, query: string | undefined): boolean {
	if (!query) return true
	const searchText = `${ticket.key} ${ticket.summary} ${ticket.status} ${ticket.assignee}`.toLowerCase()
	return searchText.includes(query.toLowerCase())
}

function ticketMatchesFilters(ticket: Ticket, filters: TicketFilters): boolean {
	return (
		matchesTicketStatus(ticket, filters.ticketStatus) &&
		matchesStringFilter(ticket.assignee, filters.assignee) &&
		matchesStringFilter(ticket.status, filters.status) &&
		matchesStringFilter(ticket.wlMainTicketType, filters.wlMainTicketType) &&
		matchesStringFilter(ticket.wlSubTicketType, filters.wlSubTicketType) &&
		matchesStringFilter(ticket.customerLevel, filters.customerLevel) &&
		matchesDateFrom(ticket.created, filters.dateFrom) &&
		matchesDateTo(ticket.created, filters.dateTo) &&
		matchesJqlQuery(ticket, filters.jqlQuery)
	)
}

export function useTicketFilters<TData>(
	data: TData[],
	activeFilters: TicketFilters
): { filterOptions: FilterOptions; filteredData: Ticket[] } {
	const filterOptions = useMemo(() => {
		return buildFilterOptions(data as Ticket[])
	}, [data])

	const filteredData = useMemo(() => {
		const tickets = data as Ticket[]
		return tickets.filter((ticket) => ticketMatchesFilters(ticket, activeFilters))
	}, [data, activeFilters])

	return { filterOptions, filteredData }
}
