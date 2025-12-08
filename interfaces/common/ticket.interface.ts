export interface ITicket {
	key: string
	summary: string
	status: string
	assignee: string
	assigneeAvatar: string | null
	created: string
	dueDate: string | null
	jiraUrl: string
	wlMainTicketType: string
	wlSubTicketType: string
	customerLevel: string
	savedStatus: string
	savedAction: string
}

export interface ITicketData {
	ticket_key: string
	status: string
	action: string
	updated_at: Date
}
