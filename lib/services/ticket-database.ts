import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import type { TicketData } from "@/lib/types"

const log = logger.db

export async function saveTicketData(
	tickets: Record<string, { status: string; action: string }>
): Promise<void> {
	const ticketCount = Object.keys(tickets).length
	log.info("Saving ticket data", { count: ticketCount })

	await prisma.$transaction(
		Object.entries(tickets).map(([ticketKey, data]) =>
			prisma.ticketData.upsert({
				where: { ticketKey },
				update: { status: data.status, action: data.action, updatedAt: new Date() },
				create: { ticketKey, status: data.status, action: data.action },
			})
		)
	)

	log.info("Ticket data saved", { count: ticketCount })
}

export async function loadTicketData(): Promise<Record<string, TicketData>> {
	try {
		const rows = await prisma.ticketData.findMany()
		const data: Record<string, TicketData> = {}
		for (const row of rows) {
			data[row.ticketKey] = {
				status: row.status,
				action: row.action,
				updated_at: row.updatedAt?.toISOString(),
			}
		}
		log.info("Ticket data loaded", { count: rows.length })
		return data
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Failed to load ticket data", { error: message })
		return {}
	}
}
