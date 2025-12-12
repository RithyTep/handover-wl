import { getJiraConfig } from "@/lib/env"

export interface TicketMessageData {
	key: string
	summary: string
	wlMainTicketType: string
	wlSubTicketType: string
	savedStatus: string
	savedAction: string
}

export interface FormatOptions {
	header?: string
	mentions?: string
	includeFooter?: boolean
}

export function formatTicketMessage(
	tickets: TicketMessageData[],
	options: FormatOptions = {}
): string {
	const { header, mentions, includeFooter = true } = options
	const jiraConfig = getJiraConfig()

	let message = ""

	if (header) {
		message += `${header}\n\n`
	}

	message += "Please refer to this ticket information\n"

	if (mentions) {
		message += `${mentions}\n`
	}

	message += "\n"

	if (tickets.length === 0) {
		message += "_No tickets to report._\n"
	} else {
		tickets.forEach((ticket, index) => {
			message += formatSingleTicket(ticket, index, jiraConfig.baseUrl)
		})
	}

	if (includeFooter) {
		message += `===========================\n`
	}

	return message.trim()
}

function formatSingleTicket(
	ticket: TicketMessageData,
	index: number,
	jiraBaseUrl: string
): string {
	const ticketUrl = `${jiraBaseUrl}/browse/${ticket.key}`

	return `--- Ticket ${index + 1} ---
Ticket Link: <${ticketUrl}|${ticket.key}> ${ticket.summary}
WL Main Type: ${ticket.wlMainTicketType}
WL Sub Type: ${ticket.wlSubTicketType}
Status: ${ticket.savedStatus}
Action: ${ticket.savedAction}

`
}

export function buildShiftHeader(shift: "evening" | "night"): string {
	const shiftLabel = shift.charAt(0).toUpperCase() + shift.slice(1)
	const dateTime = new Date().toLocaleString("en-US", {
		timeZone: "Asia/Bangkok",
		dateStyle: "full",
		timeStyle: "short",
	})
	return `*${shiftLabel} Shift Handover - ${dateTime}*`
}

export function getHandoverMarker(): string {
	return "*Ticket Handover Information*"
}
