import {
	loadTicketData,
	getCustomChannelId,
	getMemberMentions,
	getTicketsWithSavedData,
	getEnabledScheduledComments,
	updateCommentLastPosted,
} from "@/lib/services"
import { getSlackConfig } from "@/lib/env"
import { SlackMessagingService } from "./slack-messaging.service"
import { createLogger } from "@/lib/logger"
import type { ScheduledComment } from "@/lib/types"

const logger = createLogger("Handover")

export interface ScanAndReplyResult {
	success: boolean
	replied: boolean
	message: string
	handoverMessageTs?: string
	replyTs?: string
	ticketsCount?: number
	error?: string
}

interface ValidationResult {
	valid: boolean
	userToken?: string
	channelId?: string
	slackComments?: ScheduledComment[]
	errorResult?: ScanAndReplyResult
}

function createErrorResult(message: string, error?: string): ScanAndReplyResult {
	return {
		success: false,
		replied: false,
		message,
		error,
	}
}

function createSuccessResult(
	message: string,
	options: Partial<ScanAndReplyResult> = {}
): ScanAndReplyResult {
	return {
		success: true,
		replied: false,
		message,
		...options,
	}
}

export class HandoverService {
	private slackMessaging: SlackMessagingService

	constructor() {
		this.slackMessaging = new SlackMessagingService()
	}

	private async validateConfiguration(): Promise<ValidationResult> {
		const config = getSlackConfig()

		const userToken = config.userToken
		if (!userToken) {
			return {
				valid: false,
				errorResult: createErrorResult(
					"No Slack user token configured",
					"SLACK_USER_TOKEN not set"
				),
			}
		}

		const scheduledComments = await getEnabledScheduledComments()
		const slackComments = scheduledComments.filter(
			(c) => c.comment_type === "slack"
		)

		if (slackComments.length === 0) {
			return {
				valid: false,
				errorResult: createSuccessResult("No scheduled comments configured"),
			}
		}

		const customChannelId = await getCustomChannelId()
		const channelId = customChannelId || config.channelId

		if (!channelId) {
			return {
				valid: false,
				errorResult: createErrorResult(
					"No Slack channel configured",
					"No channel ID available"
				),
			}
		}

		return { valid: true, userToken, channelId, slackComments }
	}

	private async prepareTicketData() {
		const savedData = await loadTicketData()
		const tickets = await getTicketsWithSavedData(savedData)
		const ticketData = this.slackMessaging.convertTicketsToMessageData(tickets)
		const mentions = await getMemberMentions()

		return { tickets, ticketData, mentions }
	}

	private async updateAllCommentTimestamps(
		comments: ScheduledComment[]
	): Promise<void> {
		for (const comment of comments) {
			await updateCommentLastPosted(comment.id)
		}
	}

	async scanAndReplyToHandover(): Promise<ScanAndReplyResult> {
		const validation = await this.validateConfiguration()

		if (!validation.valid) {
			return validation.errorResult!
		}

		const { userToken, channelId, slackComments } = validation

		logger.info("Scanning for handover message", { channel: channelId })

		const handoverCheck = await this.slackMessaging.findHandoverMessage(
			userToken!,
			channelId!
		)

		if (!handoverCheck.found) {
			return createSuccessResult("No handover message found")
		}

		if (handoverCheck.hasReplies) {
			return createSuccessResult("Handover message already has replies", {
				handoverMessageTs: handoverCheck.messageTs,
			})
		}

		const { tickets, ticketData, mentions } = await this.prepareTicketData()

		const replyResult = await this.slackMessaging.postHandoverReply(
			ticketData,
			handoverCheck.messageTs!,
			userToken!,
			channelId!,
			mentions || undefined
		)

		if (!replyResult.success) {
			return createErrorResult("Failed to post reply", replyResult.error)
		}

		await this.updateAllCommentTimestamps(slackComments!)

		logger.info("Posted handover reply", {
			handoverTs: handoverCheck.messageTs,
			replyTs: replyResult.replyTs,
			ticketsCount: tickets.length,
		})

		return {
			success: true,
			replied: true,
			message: "Reply posted successfully",
			handoverMessageTs: handoverCheck.messageTs,
			replyTs: replyResult.replyTs,
			ticketsCount: tickets.length,
		}
	}
}
