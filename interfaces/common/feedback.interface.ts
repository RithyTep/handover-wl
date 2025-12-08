import type { FeedbackType, FeedbackStatus } from "@/enums"

export interface IFeedback {
	id: number
	type: FeedbackType
	title: string
	description: string
	created_at: Date
	status: FeedbackStatus
}

export interface IFeedbackItem {
	id: number
	type: FeedbackType
	title: string
	description: string
	created_at: string
	status: FeedbackStatus
}
