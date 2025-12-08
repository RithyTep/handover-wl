import { z } from "zod"
import { FeedbackType, FeedbackStatus, FeedbackTypeValues, FeedbackStatusValues } from "@/enums"

export { FeedbackType, FeedbackStatus }

export const FEEDBACK_TYPE_VALUES = FeedbackTypeValues
export const FEEDBACK_STATUS_VALUES = FeedbackStatusValues

export const feedbackTypeSchema = z.nativeEnum(FeedbackType)
export const feedbackStatusSchema = z.nativeEnum(FeedbackStatus)

export const feedbackSchema = z.object({
	id: z.number(),
	type: feedbackTypeSchema,
	title: z.string(),
	description: z.string(),
	created_at: z.date(),
	status: feedbackStatusSchema,
})

export type Feedback = z.infer<typeof feedbackSchema>

export const createFeedbackSchema = z.object({
	type: feedbackTypeSchema,
	title: z.string().min(1, "Title is required").max(200, "Title too long"),
	description: z.string().min(1, "Description is required").max(5000, "Description too long"),
})

export type CreateFeedback = z.infer<typeof createFeedbackSchema>
