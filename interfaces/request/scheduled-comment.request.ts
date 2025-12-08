import type { CommentType } from "@/enums"

export interface ICreateScheduledCommentRequest {
	comment_type: CommentType
	comment_text: string
	cron_schedule: string
	enabled: boolean
	ticket_key?: string
}

export interface IUpdateScheduledCommentRequest {
	id: number
	comment_type: CommentType
	comment_text: string
	cron_schedule: string
	enabled: boolean
	ticket_key?: string
}

export interface IDeleteScheduledCommentRequest {
	id: number
}
