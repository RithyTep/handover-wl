import {
	postMessage,
	postThreadReply,
	getHistory,
	getThreadReplies,
} from "@/lib/services/slack"
import { getSlackConfig } from "@/lib/env"
import { createLogger } from "@/lib/logger"
import type { Ticket } from "@/lib/types"
import {
	type TicketMessageData,
	type FormatOptions,
	formatTicketMessage,
	buildShiftHeader,
	getHandoverMarker,
} from "./slack-formatter.service"

const logger = createLogger("SlackMessaging")

export type { TicketMessageData, FormatOptions }

export interface HandoverMessageResult {
	success: boolean
	messageTs?: string
	error?: string
}

export interface ThreadReplyResult {
	success: boolean
	replyTs?: string
	error?: string
}

export interface HandoverCheckResult {
	found: boolean
	messageTs?: string
	hasReplies: boolean
}

async function postTicketSummary(
	tickets: TicketMessageData[],
	channel: string,
	token?: string
): Promise<HandoverMessageResult> {
	const message = formatTicketMessage(tickets)

	logger.info("Posting ticket summary", {
		channel,
		ticketCount: tickets.length,
	})

	const response = await postMessage(message, channel, undefined, token)

	if (!response.ok) {
		logger.error("Failed to post ticket summary", { error: response.error })
		return { success: false, error: response.error }
	}

	return { success: true, messageTs: response.ts }
}

interface ShiftHandoverOptions {
	tickets: TicketMessageData[]
	shift: "evening" | "night"
	channel: string
	token: string
	mentions?: string
}

async function postShiftHandoverMessage(
	options: ShiftHandoverOptions
): Promise<HandoverMessageResult> {
	const { tickets, shift, channel, token, mentions } = options
	const header = buildShiftHeader(shift)
	const message = formatTicketMessage(tickets, { header, mentions })

	logger.info("Posting shift handover", {
		shift,
		channel,
		ticketCount: tickets.length,
	})

	const response = await postMessage(message, channel, undefined, token)

	if (!response.ok) {
		logger.error("Failed to post shift handover", {
			shift,
			error: response.error,
		})
		return { success: false, error: response.error }
	}

	return { success: true, messageTs: response.ts }
}

interface HandoverReplyOptions {
	tickets: TicketMessageData[]
	threadTs: string
	channel: string
	token: string
	mentions?: string
}

async function postHandoverReplyMessage(
	options: HandoverReplyOptions
): Promise<ThreadReplyResult> {
	const { tickets, threadTs, channel, token, mentions } = options
	const message = formatTicketMessage(tickets, {
		mentions,
		includeFooter: false,
	})

	logger.info("Posting handover reply", {
		channel,
		threadTs,
		ticketCount: tickets.length,
	})

	const response = await postThreadReply(message, threadTs, channel, token)

	if (!response.ok) {
		logger.error("Failed to post handover reply", { error: response.error })
		return { success: false, error: response.error }
	}

	return { success: true, replyTs: response.ts }
}

async function findHandoverMessageInChannel(
	channel: string,
	token: string,
	limit: number = 10
): Promise<HandoverCheckResult> {
	logger.debug("Searching for handover message", { channel, limit })

	const historyResponse = await getHistory(channel, limit, token)

	if (!historyResponse.ok || !historyResponse.messages) {
		logger.warn("Failed to fetch channel history", {
			error: historyResponse.error,
		})
		return { found: false, hasReplies: false }
	}

	const handoverMessage = historyResponse.messages.find(
		(msg: { text?: string }) =>
			msg.text && msg.text.includes(getHandoverMarker())
	)

	if (!handoverMessage) {
		logger.debug("No handover message found")
		return { found: false, hasReplies: false }
	}

	const repliesResponse = await getThreadReplies(handoverMessage.ts, channel, token)

	const hasReplies = Boolean(
		repliesResponse.ok &&
			repliesResponse.messages &&
			repliesResponse.messages.length > 1
	)

	logger.debug("Found handover message", {
		messageTs: handoverMessage.ts,
		hasReplies,
	})

	return {
		found: true,
		messageTs: handoverMessage.ts,
		hasReplies,
	}
}

export class SlackMessagingService {
	async postTicketSummary(
		tickets: TicketMessageData[],
		channel?: string,
		token?: string
	): Promise<HandoverMessageResult> {
		const config = getSlackConfig()
		const targetChannel = channel || config.channelId

		if (!targetChannel) {
			return { success: false, error: "No channel specified" }
		}

		return postTicketSummary(tickets, targetChannel, token)
	}

	async postShiftHandover(
		tickets: TicketMessageData[],
		shift: "evening" | "night",
		token: string,
		channel?: string,
		mentions?: string
	): Promise<HandoverMessageResult> {
		const config = getSlackConfig()
		const targetChannel = channel || config.channelId

		if (!targetChannel) {
			return { success: false, error: "No channel specified" }
		}

		return postShiftHandoverMessage({
			tickets,
			shift,
			channel: targetChannel,
			token,
			mentions,
		})
	}

	async postHandoverReply(
		tickets: TicketMessageData[],
		threadTs: string,
		token: string,
		channel?: string,
		mentions?: string
	): Promise<ThreadReplyResult> {
		const config = getSlackConfig()
		const targetChannel = channel || config.channelId

		if (!targetChannel) {
			return { success: false, error: "No channel specified" }
		}

		return postHandoverReplyMessage({
			tickets,
			threadTs,
			channel: targetChannel,
			token,
			mentions,
		})
	}

	async findHandoverMessage(
		token: string,
		channel?: string,
		limit: number = 10
	): Promise<HandoverCheckResult> {
		const config = getSlackConfig()
		const targetChannel = channel || config.channelId

		if (!targetChannel) {
			return { found: false, hasReplies: false }
		}

		return findHandoverMessageInChannel(targetChannel, token, limit)
	}

	convertTicketsToMessageData(tickets: Ticket[]): TicketMessageData[] {
		return tickets.map((ticket) => ({
			key: ticket.key,
			summary: ticket.summary,
			wlMainTicketType: ticket.wlMainTicketType || "--",
			wlSubTicketType: ticket.wlSubTicketType || "--",
			savedStatus: ticket.savedStatus || "--",
			savedAction: ticket.savedAction || "--",
		}))
	}

	formatMessage(tickets: TicketMessageData[], options?: FormatOptions): string {
		return formatTicketMessage(tickets, options)
	}
}
