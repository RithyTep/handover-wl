import { NextResponse } from "next/server"
import { loadTicketData, getTicketsWithSavedData } from "@/lib/services"
import { SlackMessagingService } from "@/server/services/slack-messaging.service"
import { ensureHandoverTicketsFilled } from "@/server/services/handover-ai.service"
import { formatTicketCopyMessage } from "@/server/services/slack-formatter.service"
import { handleApiError } from "@/lib/api"

function hasHandoverData(ticket: { savedStatus?: string; savedAction?: string }) {
	const status = ticket.savedStatus?.trim()
	const action = ticket.savedAction?.trim()
	return (status && status !== "--") || (action && action !== "--")
}

export async function GET() {
	try {
		const slackMessaging = new SlackMessagingService()
		const savedData = await loadTicketData()
		const tickets = await getTicketsWithSavedData(savedData)

		if (tickets.length === 0) {
			return NextResponse.json({ text: "No tickets in the handover queue." })
		}

		const fillResult = await ensureHandoverTicketsFilled(tickets)
		const ticketsWithData = fillResult.tickets.filter(hasHandoverData)

		if (ticketsWithData.length === 0) {
			return NextResponse.json({
				text: "No tickets have handover status/action filled.",
			})
		}

		const ticketData = slackMessaging.convertTicketsToMessageData(ticketsWithData)
		const copyText = formatTicketCopyMessage(ticketData)

		return NextResponse.json({ text: copyText })
	} catch (error) {
		return handleApiError(error, "GET /api/handover-copy")
	}
}
