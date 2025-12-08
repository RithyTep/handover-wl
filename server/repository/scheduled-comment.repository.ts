import { CommentType } from "@/enums"
import { withClient } from "./database.repository"
import type { ScheduledComment } from "@/lib/types"

export class ScheduledCommentRepository {
	async findAll(): Promise<ScheduledComment[]> {
		return withClient(async (client) => {
			const result = await client.query("SELECT * FROM scheduled_comments ORDER BY created_at DESC")
			return result.rows
		}, [])
	}

	async findEnabled(): Promise<ScheduledComment[]> {
		return withClient(async (client) => {
			const result = await client.query(
				"SELECT * FROM scheduled_comments WHERE enabled = true ORDER BY created_at DESC"
			)
			return result.rows
		}, [])
	}

	async findById(id: number): Promise<ScheduledComment | null> {
		return withClient(async (client) => {
			const result = await client.query("SELECT * FROM scheduled_comments WHERE id = $1", [id])
			return result.rows[0] ?? null
		}, null)
	}

	async insert(
		commentType: CommentType,
		commentText: string,
		cronSchedule: string,
		enabled: boolean,
		ticketKey: string | null
	): Promise<ScheduledComment> {
		return withClient(async (client) => {
			const result = await client.query(
				`INSERT INTO scheduled_comments (comment_type, ticket_key, comment_text, cron_schedule, enabled)
				 VALUES ($1, $2, $3, $4, $5) RETURNING *`,
				[commentType, ticketKey, commentText, cronSchedule, enabled]
			)
			return result.rows[0]
		}, null as unknown as ScheduledComment)
	}

	async update(
		id: number,
		commentType: CommentType,
		commentText: string,
		cronSchedule: string,
		enabled: boolean,
		ticketKey: string | null
	): Promise<ScheduledComment | null> {
		return withClient(async (client) => {
			const result = await client.query(
				`UPDATE scheduled_comments
				 SET comment_type = $1, ticket_key = $2, comment_text = $3, cron_schedule = $4, enabled = $5, updated_at = CURRENT_TIMESTAMP
				 WHERE id = $6 RETURNING *`,
				[commentType, ticketKey, commentText, cronSchedule, enabled, id]
			)
			return result.rows[0] ?? null
		}, null)
	}

	async delete(id: number): Promise<boolean> {
		return withClient(async (client) => {
			const result = await client.query("DELETE FROM scheduled_comments WHERE id = $1", [id])
			return (result.rowCount ?? 0) > 0
		}, false)
	}

	async updateLastPosted(id: number): Promise<void> {
		await withClient(async (client) => {
			await client.query(
				"UPDATE scheduled_comments SET last_posted_at = CURRENT_TIMESTAMP WHERE id = $1",
				[id]
			)
		}, undefined)
	}
}
