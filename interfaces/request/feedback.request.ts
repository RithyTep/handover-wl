import type { FeedbackType } from "@/enums"

export interface ICreateFeedbackRequest {
	type: FeedbackType
	title: string
	description: string
}
