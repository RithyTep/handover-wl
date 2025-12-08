import { z } from "zod"
import { FeedbackType, FeedbackStatus } from "@/enums"

export const feedbackTypeSchema = z.nativeEnum(FeedbackType)
export const feedbackStatusSchema = z.nativeEnum(FeedbackStatus)

export const feedbackCreateSchema = z.object({
	type: feedbackTypeSchema,
	title: z.string().min(1, "Title is required").max(200, "Title too long"),
	description: z.string().min(1, "Description is required").max(2000, "Description too long"),
})

export const feedbackUpdateStatusSchema = z.object({
	id: z.number().int().positive(),
	status: feedbackStatusSchema,
})

export type FeedbackCreateRequest = z.infer<typeof feedbackCreateSchema>
export type FeedbackUpdateStatusRequest = z.infer<typeof feedbackUpdateStatusSchema>
