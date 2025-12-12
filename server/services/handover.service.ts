/**
 * Handover Service
 *
 * Orchestrates handover operations including scanning for handover messages
 * and posting automated replies with ticket information.
 */

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

const logger = createLogger("Handover")

// ============================================
// Types
// ============================================

export interface ScanAndReplyResult {
	success: boolean
	replied: boolean
	message: string
	handoverMessageTs?: string
	replyTs?: string
	ticketsCount?: number
	error?: string
}

// ============================================
// Service Class
// ============================================

export class HandoverService {
	private slackMessaging: SlackMessagingService

	constructor() {
		this.slackMessaging = new SlackMessagingService()
	}

	/**
	 * Scan for handover message and reply with ticket information
	 *
	 * This method:
	 * 1. Checks if there are enabled Slack scheduled comments
	 * 2. Finds the most recent handover message
	 * 3. Checks if it already has replies
	 * 4. If not, posts a reply with current ticket data
	 * 5. Updates the last posted timestamp for scheduled comments
	 */
	async scanAndReplyToHandover(): Promise<ScanAndReplyResult> {
		const config = getSlackConfig()

		// Get user token for API calls
		const userToken = config.userToken
		if (!userToken) {
			return {
				success: false,
				replied: false,
				message: "No Slack user token configured",
				error: "SLACK_USER_TOKEN not set",
			}
		}

		// Check for enabled Slack scheduled comments
		const scheduledComments = await getEnabledScheduledComments()
		const slackComments = scheduledComments.filter(
			(c) => c.comment_type === "slack"
		)

		if (slackComments.length === 0) {
			return {
				success: true,
				replied: false,
				message: "No scheduled comments configured",
			}
		}

		// Get channel
		const customChannelId = await getCustomChannelId()
		const channelToUse = customChannelId || config.channelId

		if (!channelToUse) {
			return {
				success: false,
				replied: false,
				message: "No Slack channel configured",
				error: "No channel ID available",
			}
		}

		logger.info("Scanning for handover message", { channel: channelToUse })

		// Find handover message
		const handoverCheck = await this.slackMessaging.findHandoverMessage(
			userToken,
			channelToUse
		)

		if (!handoverCheck.found) {
			return {
				success: true,
				replied: false,
				message: "No handover message found",
			}
		}

		// Check if already has replies
		if (handoverCheck.hasReplies) {
			return {
				success: true,
				replied: false,
				message: "Handover message already has replies",
				handoverMessageTs: handoverCheck.messageTs,
			}
		}

		// Load ticket data
		const savedData = await loadTicketData()
		const tickets = await getTicketsWithSavedData(savedData)
		const ticketData = this.slackMessaging.convertTicketsToMessageData(tickets)

		// Get member mentions
		const mentions = await getMemberMentions()

		// Post reply
		const replyResult = await this.slackMessaging.postHandoverReply(
			ticketData,
			handoverCheck.messageTs!,
			userToken,
			channelToUse,
			mentions || undefined
		)

		if (!replyResult.success) {
			return {
				success: false,
				replied: false,
				message: "Failed to post reply",
				error: replyResult.error,
				handoverMessageTs: handoverCheck.messageTs,
			}
		}

		// Update last posted timestamp for all Slack comments
		for (const comment of slackComments) {
			await updateCommentLastPosted(comment.id)
		}

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
