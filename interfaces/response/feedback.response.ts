import type { IFeedback, IFeedbackItem } from "../common/feedback.interface"

export interface IGetFeedbackListResponse {
	feedbacks: IFeedbackItem[]
}

export interface IGetFeedbackResponse {
	feedback: IFeedback
}

export interface ICreateFeedbackResponse {
	feedback: IFeedbackItem
}
