import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { TicketService } from "@/server/services/ticket.service"

const log = logger.api
const ticketService = new TicketService()

export async function GET() {
	try {
		const data = await ticketService.loadTicketData()

		// Convert to the expected format: { "status-KEY": "value", "action-KEY": "value" }
		const formattedData: Record<string, string> = {}
		for (const [ticketKey, ticketData] of Object.entries(data)) {
			formattedData[`status-${ticketKey}`] = ticketData.status
			formattedData[`action-${ticketKey}`] = ticketData.action
		}

		return new NextResponse(JSON.stringify(formattedData, null, 2), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		})
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Ticket data read error", { error: message })
		return NextResponse.json(
			{ error: "Failed to read ticket data", details: message },
			{ status: 500 }
		)
	}
}
