import type { IScheduledComment, IScheduledCommentItem } from "../common/scheduled-comment.interface"

export interface IGetScheduledCommentsResponse {
	comments: IScheduledCommentItem[]
}

export interface IGetScheduledCommentResponse {
	comment: IScheduledComment
}

export interface ICreateScheduledCommentResponse {
	comment: IScheduledCommentItem
}

export interface IUpdateScheduledCommentResponse {
	comment: IScheduledCommentItem
}

export interface IDeleteScheduledCommentResponse {
	deleted: boolean
}
