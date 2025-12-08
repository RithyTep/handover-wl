import type { CommentType } from "@/enums"

export interface IScheduledComment {
	id: number
	comment_type: CommentType
	ticket_key: string | null
	comment_text: string
	cron_schedule: string
	enabled: boolean
	created_at: Date
	updated_at: Date
	last_posted_at: Date | null
}

export interface IScheduledCommentItem {
	id: number
	comment_type: CommentType
	ticket_key: string | null
	comment_text: string
	cron_schedule: string
	enabled: boolean
	created_at: string
	updated_at: string
	last_posted_at: string | null
}
