import { z } from "zod"
import { CommentType } from "@/enums"

export const commentTypeSchema = z.nativeEnum(CommentType)

export const scheduledCommentCreateSchema = z.object({
	comment_type: commentTypeSchema,
	comment_text: z.string().min(1, "Comment text is required"),
	cron_schedule: z.string().min(1, "Cron schedule is required"),
	enabled: z.boolean(),
	ticket_key: z.string().optional(),
})

export const scheduledCommentUpdateSchema = z.object({
	id: z.number().int().positive(),
	comment_type: commentTypeSchema,
	comment_text: z.string().min(1, "Comment text is required"),
	cron_schedule: z.string().min(1, "Cron schedule is required"),
	enabled: z.boolean(),
	ticket_key: z.string().optional(),
})

export const scheduledCommentDeleteSchema = z.object({
	id: z.number().int().positive(),
})

export type ScheduledCommentCreateRequest = z.infer<typeof scheduledCommentCreateSchema>
export type ScheduledCommentUpdateRequest = z.infer<typeof scheduledCommentUpdateSchema>
export type ScheduledCommentDeleteRequest = z.infer<typeof scheduledCommentDeleteSchema>
