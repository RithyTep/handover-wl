import { prisma } from "@/lib/prisma"
import type { TicketData as PrismaTicketData } from "@/lib/generated/prisma"

// Domain type with snake_case
export interface TicketRow {
	ticket_key: string
	status: string
	action: string
	updated_at: Date | null
}

function toDomain(row: PrismaTicketData): TicketRow {
	return {
		ticket_key: row.ticketKey,
		status: row.status,
		action: row.action,
		updated_at: row.updatedAt,
	}
}

export class TicketRepository {
	async findAll(): Promise<TicketRow[]> {
		const rows = await prisma.ticketData.findMany()
		return rows.map(toDomain)
	}

	async findByKey(ticketKey: string): Promise<TicketRow | null> {
		const row = await prisma.ticketData.findUnique({
			where: { ticketKey },
		})
		return row ? toDomain(row) : null
	}

	async upsert(ticketKey: string, status: string, action: string): Promise<TicketRow> {
		const row = await prisma.ticketData.upsert({
			where: { ticketKey },
			update: { status, action, updatedAt: new Date() },
			create: { ticketKey, status, action },
		})
		return toDomain(row)
	}

	async upsertMany(tickets: Record<string, { status: string; action: string }>): Promise<void> {
		await prisma.$transaction(
			Object.entries(tickets).map(([ticketKey, data]) =>
				prisma.ticketData.upsert({
					where: { ticketKey },
					update: { status: data.status, action: data.action, updatedAt: new Date() },
					create: { ticketKey, status: data.status, action: data.action },
				})
			)
		)
	}

	async delete(ticketKey: string): Promise<boolean> {
		try {
			await prisma.ticketData.delete({
				where: { ticketKey },
			})
			return true
		} catch {
			return false
		}
	}

	async deleteAll(): Promise<void> {
		await prisma.ticketData.deleteMany()
	}
}
