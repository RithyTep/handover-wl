export interface TicketFilters {
	assignee?: string
	status?: string
	wlMainTicketType?: string
	wlSubTicketType?: string
	customerLevel?: string
	dateFrom?: string
	dateTo?: string
	jqlQuery?: string
}

export interface SavedFilter {
	id: string
	name: string
	filters: TicketFilters
}

export interface FilterSelectProps {
	label: string
	value: string
	options: string[]
	placeholder: string
	onChange: (value: string) => void
}
