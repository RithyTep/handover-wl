import { BackupType } from "@/enums"
import { withClient, withTransaction } from "./database.repository"
import type { Backup } from "@/lib/types"

interface BackupData {
	ticketData: Record<string, { status: string; action: string }>
	appSettings: Record<string, string>
	scheduledComments: Array<{
		comment_type: string
		ticket_key: string | null
		comment_text: string
		cron_schedule: string
		enabled: boolean
	}>
}

export class BackupRepository {
	async findAll(limit: number): Promise<Backup[]> {
		return withClient(async (client) => {
			const result = await client.query(
				"SELECT * FROM backups ORDER BY created_at DESC LIMIT $1",
				[limit]
			)
			return result.rows
		}, [])
	}

	async findById(id: number): Promise<Backup | null> {
		return withClient(async (client) => {
			const result = await client.query("SELECT * FROM backups WHERE id = $1", [id])
			return result.rows[0] ?? null
		}, null)
	}

	async insert(
		backupType: BackupType,
		data: BackupData,
		description?: string
	): Promise<Backup> {
		return withClient(async (client) => {
			const result = await client.query(
				`INSERT INTO backups (backup_type, ticket_data, app_settings, scheduled_comments, description)
				 VALUES ($1, $2, $3, $4, $5) RETURNING *`,
				[
					backupType,
					JSON.stringify(data.ticketData),
					JSON.stringify(data.appSettings),
					JSON.stringify(data.scheduledComments),
					description,
				]
			)
			return result.rows[0]
		}, null as unknown as Backup)
	}

	async delete(id: number): Promise<boolean> {
		return withClient(async (client) => {
			const result = await client.query("DELETE FROM backups WHERE id = $1", [id])
			return (result.rowCount ?? 0) > 0
		}, false)
	}

	async deleteOldBackups(keepCount: number): Promise<number> {
		return withClient(async (client) => {
			const result = await client.query(
				`DELETE FROM backups WHERE id NOT IN (SELECT id FROM backups ORDER BY created_at DESC LIMIT $1)`,
				[keepCount]
			)
			return result.rowCount ?? 0
		}, 0)
	}

	async restoreTicketData(tickets: Record<string, { status: string; action: string }>): Promise<void> {
		await withTransaction(async (client) => {
			await client.query("DELETE FROM ticket_data")
			for (const [key, data] of Object.entries(tickets)) {
				await client.query(
					"INSERT INTO ticket_data (ticket_key, status, action) VALUES ($1, $2, $3)",
					[key, data.status, data.action]
				)
			}
		})
	}

	async restoreAppSettings(settings: Record<string, string>): Promise<void> {
		await withTransaction(async (client) => {
			for (const [key, value] of Object.entries(settings)) {
				await client.query(
					`INSERT INTO app_settings (key, value, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP)
					 ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
					[key, value]
				)
			}
		})
	}

	async restoreScheduledComments(
		comments: Array<{
			comment_type: string
			ticket_key: string | null
			comment_text: string
			cron_schedule: string
			enabled: boolean
		}>
	): Promise<void> {
		await withTransaction(async (client) => {
			await client.query("DELETE FROM scheduled_comments")
			for (const comment of comments) {
				await client.query(
					`INSERT INTO scheduled_comments (comment_type, ticket_key, comment_text, cron_schedule, enabled)
					 VALUES ($1, $2, $3, $4, $5)`,
					[
						comment.comment_type,
						comment.ticket_key,
						comment.comment_text,
						comment.cron_schedule,
						comment.enabled,
					]
				)
			}
		})
	}
}
