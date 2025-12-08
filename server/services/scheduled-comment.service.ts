import { CommentType } from "@/enums"
import { ScheduledCommentRepository } from "@/server/repository/scheduled-comment.repository"
import type { ScheduledComment } from "@/lib/types"
import type { IScheduledCommentItem } from "@/interfaces"

export class ScheduledCommentService {
	private repository: ScheduledCommentRepository

	constructor() {
		this.repository = new ScheduledCommentRepository()
	}

	async getAll(): Promise<ScheduledComment[]> {
		return this.repository.findAll()
	}

	async getAllItems(): Promise<IScheduledCommentItem[]> {
		const comments = await this.repository.findAll()
		return comments.map((c) => this.toItem(c))
	}

	async getEnabled(): Promise<ScheduledComment[]> {
		return this.repository.findEnabled()
	}

	async getById(id: number): Promise<ScheduledComment | null> {
		return this.repository.findById(id)
	}

	async create(
		commentType: CommentType,
		commentText: string,
		cronSchedule: string,
		enabled: boolean,
		ticketKey?: string
	): Promise<ScheduledComment> {
		return this.repository.insert(
			commentType,
			commentText,
			cronSchedule,
			enabled,
			ticketKey ?? null
		)
	}

	async update(
		id: number,
		commentType: CommentType,
		commentText: string,
		cronSchedule: string,
		enabled: boolean,
		ticketKey?: string
	): Promise<ScheduledComment | null> {
		return this.repository.update(
			id,
			commentType,
			commentText,
			cronSchedule,
			enabled,
			ticketKey ?? null
		)
	}

	async delete(id: number): Promise<boolean> {
		return this.repository.delete(id)
	}

	async updateLastPosted(id: number): Promise<void> {
		await this.repository.updateLastPosted(id)
	}

	toItem(comment: ScheduledComment): IScheduledCommentItem {
		const toDateString = (value: Date | string | undefined | null): string | null => {
			if (!value) return null
			if (typeof value === "string") return value
			return value.toISOString()
		}

		return {
			id: comment.id,
			comment_type: comment.comment_type,
			ticket_key: comment.ticket_key ?? null,
			comment_text: comment.comment_text,
			cron_schedule: comment.cron_schedule,
			enabled: comment.enabled,
			created_at: toDateString(comment.created_at) ?? new Date().toISOString(),
			updated_at: toDateString(comment.updated_at) ?? new Date().toISOString(),
			last_posted_at: toDateString(comment.last_posted_at),
		}
	}
}
