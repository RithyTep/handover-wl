import { FeedbackType, FeedbackStatus } from "@/enums"
import { withClient } from "./database.repository"
import type { Feedback } from "@/lib/types"

export class FeedbackRepository {
	async findAll(limit: number): Promise<Feedback[]> {
		return withClient(async (client) => {
			const result = await client.query(
				`SELECT id, type, title, description, created_at, status
				 FROM feedback
				 ORDER BY created_at DESC
				 LIMIT $1`,
				[limit]
			)
			return result.rows
		}, [])
	}

	async findById(id: number): Promise<Feedback | null> {
		return withClient(async (client) => {
			const result = await client.query(
				`SELECT id, type, title, description, created_at, status
				 FROM feedback
				 WHERE id = $1`,
				[id]
			)
			return result.rows[0] ?? null
		}, null)
	}

	async insert(type: FeedbackType, title: string, description: string, status: FeedbackStatus): Promise<Feedback> {
		return withClient(async (client) => {
			const result = await client.query(
				`INSERT INTO feedback (type, title, description, created_at, status)
				 VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)
				 RETURNING id, type, title, description, created_at, status`,
				[type, title, description, status]
			)
			return result.rows[0]
		}, null as unknown as Feedback)
	}

	async updateStatus(id: number, status: FeedbackStatus): Promise<Feedback | null> {
		return withClient(async (client) => {
			const result = await client.query(
				`UPDATE feedback SET status = $1 WHERE id = $2
				 RETURNING id, type, title, description, created_at, status`,
				[status, id]
			)
			return result.rows[0] ?? null
		}, null)
	}

	async delete(id: number): Promise<boolean> {
		return withClient(async (client) => {
			const result = await client.query("DELETE FROM feedback WHERE id = $1", [id])
			return (result.rowCount ?? 0) > 0
		}, false)
	}
}
