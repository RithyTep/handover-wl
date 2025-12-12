import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { CommentType } from "@/enums"
import type { ScheduledComment } from "@/lib/types"

const log = logger.db

function transformScheduledComment(row: {
	id: number
	commentType: string
	ticketKey: string | null
	commentText: string
	cronSchedule: string
	enabled: boolean
	createdAt: Date
	updatedAt: Date
	lastPostedAt: Date | null
}): ScheduledComment {
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

export async function getScheduledComments(): Promise<ScheduledComment[]> {
	try {
		const rows = await prisma.scheduledComment.findMany({
			orderBy: { createdAt: "desc" },
		})
		return rows.map(transformScheduledComment)
	} catch {
		return []
	}
}

export async function getEnabledScheduledComments(): Promise<ScheduledComment[]> {
	try {
		const rows = await prisma.scheduledComment.findMany({
			where: { enabled: true },
			orderBy: { createdAt: "desc" },
		})
		return rows.map(transformScheduledComment)
	} catch {
		return []
	}
}

export interface CreateScheduledCommentOptions {
	commentType: "jira" | "slack"
	commentText: string
	cronSchedule: string
	enabled?: boolean
	ticketKey?: string
}

export async function createScheduledComment(
	options: CreateScheduledCommentOptions
): Promise<ScheduledComment | null> {
	const { commentType, commentText, cronSchedule, enabled = true, ticketKey } = options
	log.info("Creating scheduled comment", { commentType, ticketKey })
	try {
		const row = await prisma.scheduledComment.create({
			data: {
				commentType,
				ticketKey: ticketKey || null,
				commentText,
				cronSchedule,
				enabled,
			},
		})
		return transformScheduledComment(row)
	} catch {
		return null
	}
}

export interface UpdateScheduledCommentOptions {
	id: number
	commentType: "jira" | "slack"
	commentText: string
	cronSchedule: string
	enabled: boolean
	ticketKey?: string
}

export async function updateScheduledComment(
	options: UpdateScheduledCommentOptions
): Promise<ScheduledComment | null> {
	const { id, commentType, commentText, cronSchedule, enabled, ticketKey } = options
	log.info("Updating scheduled comment", { id, commentType })
	try {
		const row = await prisma.scheduledComment.update({
			where: { id },
			data: {
				commentType,
				ticketKey: ticketKey || null,
				commentText,
				cronSchedule,
				enabled,
				updatedAt: new Date(),
			},
		})
		return transformScheduledComment(row)
	} catch {
		return null
	}
}

export async function deleteScheduledComment(id: number): Promise<boolean> {
	log.info("Deleting scheduled comment", { id })
	try {
		await prisma.scheduledComment.delete({ where: { id } })
		return true
	} catch {
		return false
	}
}

export async function updateCommentLastPosted(id: number): Promise<void> {
	await prisma.scheduledComment.update({
		where: { id },
		data: { lastPostedAt: new Date() },
	})
}
