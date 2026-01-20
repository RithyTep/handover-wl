import { NextRequest } from "next/server"
import { loadTicketData, getTicketsWithSavedData } from "@/lib/services"
import { getSlackConfig } from "@/lib/env"
import { SlackMessagingService } from "@/server/services"
import { ensureHandoverTicketsFilled } from "@/server/services/handover-ai.service"
import { apiSuccess, badRequest, handleApiError } from "@/lib/api"

const slackMessaging = new SlackMessagingService()

export async function POST(_request: NextRequest) {
	try {
		const slackConfig = getSlackConfig()

		if (!slackConfig.botToken) {
			return badRequest("Missing SLACK_BOT_TOKEN")
		}

		if (!slackConfig.channelId) {
			return badRequest("Missing SLACK_CHANNEL or SLACK_CHANNEL_ID")
		}

		const savedData = await loadTicketData()
		const tickets = await getTicketsWithSavedData(savedData)

		if (tickets.length === 0) {
			return badRequest("No tickets in the handover queue to send.")
		}

		const fillResult = await ensureHandoverTicketsFilled(tickets)
		const ticketsWithData = fillResult.tickets

		if (ticketsWithData.length === 0) {
			return badRequest("No tickets in the handover queue to send.")
		}

		const ticketData = slackMessaging.convertTicketsToMessageData(ticketsWithData)

		const result = await slackMessaging.postTicketSummary(
			ticketData,
			slackConfig.channelId,
			slackConfig.botToken
		)

		if (!result.success) {
			return handleApiError(
				new Error(result.error || "Failed to post message"),
				"POST /api/handover-send"
			)
		}

		return apiSuccess({
			ticketsProcessed: ticketsWithData.length,
			aiFilled: fillResult.filledCount,
			message_ts: result.messageTs,
			sentAt: new Date().toISOString(),
		})
	} catch (error: unknown) {
		return handleApiError(error, "POST /api/handover-send")
	}
}
