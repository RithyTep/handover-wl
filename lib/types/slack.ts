import { z } from "zod"

export interface SlackBlock {
	type: string
	text?: {
		type: string
		text: string
		emoji?: boolean
	}
	elements?: SlackBlockElement[]
	accessory?: SlackAccessory
	block_id?: string
}

export interface SlackBlockElement {
	type: string
	text?: string
	action_id?: string
	value?: string
	[key: string]: unknown
}

export interface SlackAccessory {
	type: string
	text?: {
		type: string
		text: string
		emoji?: boolean
	}
	action_id?: string
	[key: string]: unknown
}

export interface SlackMessage {
	type: string
	text: string
	user?: string
	ts: string
	thread_ts?: string
	reply_count?: number
	[key: string]: unknown
}

export interface SlackResponse {
	ok: boolean
	error?: string
	ts?: string
	channel?: string
	message?: SlackMessage
	messages?: SlackMessage[]
}

export const slackMessageSchema = z.object({
	channel: z.string().min(1),
	text: z.string().min(1),
	thread_ts: z.string().optional(),
	blocks: z.array(z.record(z.string(), z.unknown())).optional(),
})

export type SlackMessageInput = z.infer<typeof slackMessageSchema>
