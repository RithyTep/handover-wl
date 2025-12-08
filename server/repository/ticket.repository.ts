import { withClient, withTransaction } from "./database.repository"

interface TicketDataRow {
	ticket_key: string
	status: string
	action: string
	updated_at: Date
}

export class TicketRepository {
	async findAll(): Promise<TicketDataRow[]> {
		return withClient(async (client) => {
			const result = await client.query("SELECT ticket_key, status, action, updated_at FROM ticket_data")
			return result.rows
		}, [])
	}

	async findByKey(ticketKey: string): Promise<TicketDataRow | null> {
		return withClient(async (client) => {
			const result = await client.query(
				"SELECT ticket_key, status, action, updated_at FROM ticket_data WHERE ticket_key = $1",
				[ticketKey]
			)
			return result.rows[0] ?? null
		}, null)
	}

	async upsert(ticketKey: string, status: string, action: string): Promise<void> {
		await withClient(async (client) => {
			await client.query(
				`INSERT INTO ticket_data (ticket_key, status, action, updated_at)
				 VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
				 ON CONFLICT (ticket_key)
				 DO UPDATE SET status = EXCLUDED.status, action = EXCLUDED.action, updated_at = CURRENT_TIMESTAMP`,
				[ticketKey, status, action]
			)
		}, undefined)
	}

	async upsertMany(tickets: Record<string, { status: string; action: string }>): Promise<void> {
		await withTransaction(async (client) => {
			for (const [ticketKey, data] of Object.entries(tickets)) {
				await client.query(
					`INSERT INTO ticket_data (ticket_key, status, action, updated_at)
					 VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
					 ON CONFLICT (ticket_key)
					 DO UPDATE SET status = EXCLUDED.status, action = EXCLUDED.action, updated_at = CURRENT_TIMESTAMP`,
					[ticketKey, data.status, data.action]
				)
			}
		})
	}

	async delete(ticketKey: string): Promise<boolean> {
		return withClient(async (client) => {
			const result = await client.query("DELETE FROM ticket_data WHERE ticket_key = $1", [ticketKey])
			return (result.rowCount ?? 0) > 0
		}, false)
	}

	async deleteAll(): Promise<void> {
		await withClient(async (client) => {
			await client.query("DELETE FROM ticket_data")
		}, undefined)
	}
}
