import { z } from "zod"
import { CommentType, CommentTypeValues } from "@/enums"

export { CommentType }

export const COMMENT_TYPE_VALUES = CommentTypeValues

export const commentTypeSchema = z.nativeEnum(CommentType)

export const scheduledCommentSchema = z.object({
	id: z.number(),
	comment_type: commentTypeSchema,
	ticket_key: z.string().optional(),
	comment_text: z.string(),
	cron_schedule: z.string(),
	enabled: z.boolean(),
	created_at: z.date().optional(),
	updated_at: z.date().optional(),
	last_posted_at: z.date().nullable().optional(),
})

export type ScheduledComment = z.infer<typeof scheduledCommentSchema>

export const createScheduledCommentSchema = z.object({
	comment_type: commentTypeSchema,
	ticket_key: z.string().optional(),
	comment_text: z.string().min(1, "Comment text is required"),
	cron_schedule: z.string().min(1, "Cron schedule is required"),
	enabled: z.boolean().default(true),
})

export type CreateScheduledComment = z.infer<typeof createScheduledCommentSchema>

export const updateScheduledCommentSchema = z.object({
	id: z.number(),
	comment_type: commentTypeSchema.optional(),
	ticket_key: z.string().optional(),
	comment_text: z.string().optional(),
	cron_schedule: z.string().optional(),
	enabled: z.boolean().optional(),
})

export type UpdateScheduledComment = z.infer<typeof updateScheduledCommentSchema>
