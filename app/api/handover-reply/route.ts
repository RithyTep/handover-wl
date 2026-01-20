import { NextRequest } from "next/server"
import { loadTicketData, getTicketsWithSavedData } from "@/lib/services"
import { getSlackConfig } from "@/lib/env"
import { SlackMessagingService } from "@/server/services"
import { ensureHandoverTicketsFilled } from "@/server/services/handover-ai.service"
import { apiSuccess, badRequest, handleApiError } from "@/lib/api"

const slackMessaging = new SlackMessagingService()

export async function POST(request: NextRequest) {
	try {
		const body = await request.json().catch(() => ({}))
		const config = getSlackConfig()
		const token = body.token || config.userToken
		const channelId = body.channelId || config.channelId
		const limit = Number(body.limit) || 10
		const mentions = typeof body.mentions === "string" ? body.mentions : undefined

		if (!token) {
			return badRequest("Missing Slack user token")
		}

		if (!channelId) {
			return badRequest("Missing Slack channel ID")
		}

		const savedData = await loadTicketData()
		const tickets = await getTicketsWithSavedData(savedData)

		if (tickets.length === 0) {
			return badRequest("No tickets in the handover queue to reply with.")
		}

		const fillResult = await ensureHandoverTicketsFilled(tickets)
		const ticketsWithData = fillResult.tickets

		const handoverCheck = await slackMessaging.findHandoverMessage(
			token,
			channelId,
			limit
		)

		if (!handoverCheck.found) {
			return apiSuccess({
				replied: false,
				message: "No handover message found",
			})
		}

		if (handoverCheck.hasReplies) {
			return apiSuccess({
				replied: false,
				message: "Handover message already has replies",
				handoverMessageTs: handoverCheck.messageTs,
			})
		}

		const ticketData = slackMessaging.convertTicketsToMessageData(ticketsWithData)
		const replyResult = await slackMessaging.postHandoverReply(
			ticketData,
			handoverCheck.messageTs!,
			token,
			channelId,
			mentions
		)

		if (!replyResult.success) {
			return handleApiError(
				new Error(replyResult.error || "Failed to post reply"),
				"POST /api/handover-reply"
			)
		}

		return apiSuccess({
			replied: true,
			ticketsProcessed: ticketsWithData.length,
			aiFilled: fillResult.filledCount,
			handoverMessageTs: handoverCheck.messageTs,
			replyTs: replyResult.replyTs,
			sentAt: new Date().toISOString(),
		})
	} catch (error: unknown) {
		return handleApiError(error, "POST /api/handover-reply")
	}
}
