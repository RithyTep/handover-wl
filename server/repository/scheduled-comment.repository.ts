import { prisma } from "@/lib/prisma"
import { CommentType } from "@/enums"
import type { ScheduledComment as PrismaScheduledComment } from "@/lib/generated/prisma"
import type { ScheduledComment } from "@/lib/types"

function toDomain(row: PrismaScheduledComment): ScheduledComment {
	return {
		id: row.id,
		comment_type: row.commentType as CommentType,
		ticket_key: row.ticketKey ?? undefined,
		comment_text: row.commentText,
		cron_schedule: row.cronSchedule,
		enabled: row.enabled,
		created_at: row.createdAt,
		updated_at: row.updatedAt,
		last_posted_at: row.lastPostedAt,
	}
}

export class ScheduledCommentRepository {
	async findAll(): Promise<ScheduledComment[]> {
		const rows = await prisma.scheduledComment.findMany({
			orderBy: { createdAt: "desc" },
		})
		return rows.map(toDomain)
	}

	async findEnabled(): Promise<ScheduledComment[]> {
		const rows = await prisma.scheduledComment.findMany({
			where: { enabled: true },
			orderBy: { createdAt: "desc" },
		})
		return rows.map(toDomain)
	}

	async findById(id: number): Promise<ScheduledComment | null> {
		const row = await prisma.scheduledComment.findUnique({
			where: { id },
		})
		return row ? toDomain(row) : null
	}

	async insert(
		commentType: CommentType,
		commentText: string,
		cronSchedule: string,
		enabled: boolean,
		ticketKey: string | null
	): Promise<ScheduledComment> {
		const row = await prisma.scheduledComment.create({
			data: {
				commentType,
				ticketKey,
				commentText,
				cronSchedule,
				enabled,
			},
		})
		return toDomain(row)
	}

	async update(
		id: number,
		commentType: CommentType,
		commentText: string,
		cronSchedule: string,
		enabled: boolean,
		ticketKey: string | null
	): Promise<ScheduledComment | null> {
		try {
			const row = await prisma.scheduledComment.update({
				where: { id },
				data: {
					commentType,
					ticketKey,
					commentText,
					cronSchedule,
					enabled,
					updatedAt: new Date(),
				},
			})
			return toDomain(row)
		} catch {
			return null
		}
	}

	async delete(id: number): Promise<boolean> {
		try {
			await prisma.scheduledComment.delete({
				where: { id },
			})
			return true
		} catch {
			return false
		}
	}

	async updateLastPosted(id: number): Promise<void> {
		await prisma.scheduledComment.update({
			where: { id },
			data: { lastPostedAt: new Date() },
		})
	}

	async deleteAll(): Promise<void> {
		await prisma.scheduledComment.deleteMany()
	}

	async createMany(
		comments: Array<{
			comment_type: string
			ticket_key: string | null
			comment_text: string
			cron_schedule: string
			enabled: boolean
		}>
	): Promise<void> {
		await prisma.scheduledComment.createMany({
			data: comments.map((c) => ({
				commentType: c.comment_type,
				ticketKey: c.ticket_key,
				commentText: c.comment_text,
				cronSchedule: c.cron_schedule,
				enabled: c.enabled,
			})),
		})
	}
}
