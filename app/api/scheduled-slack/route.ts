import { NextRequest } from "next/server"
import {
	loadTicketData,
	getCustomChannelId,
	getEveningUserToken,
	getNightUserToken,
	getEveningMentions,
	getNightMentions,
	getTicketsWithSavedData,
} from "@/lib/services"
import { SlackMessagingService } from "@/server/services"
import { apiSuccess, badRequest, handleApiError } from "@/lib/api"

const slackMessaging = new SlackMessagingService()

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const shift = body.shift as "evening" | "night" | undefined

		if (!shift || !["evening", "night"].includes(shift)) {
			return badRequest("Shift parameter (evening or night) is required")
		}

		const userToken =
			shift === "evening"
				? await getEveningUserToken()
				: await getNightUserToken()

		if (!userToken) {
			return badRequest(`No user token configured for ${shift} shift`)
		}

		const mentions =
			shift === "evening"
				? await getEveningMentions()
				: await getNightMentions()

		const customChannelId = await getCustomChannelId()

		const savedData = await loadTicketData()
		const tickets = await getTicketsWithSavedData(savedData)

		const ticketData = slackMessaging.convertTicketsToMessageData(tickets)

		const result = await slackMessaging.postShiftHandover(
			ticketData,
			shift,
			userToken,
			customChannelId || undefined,
			mentions || undefined
		)

		if (!result.success) {
			return handleApiError(
				new Error(result.error || "Failed to post message"),
				"POST /api/scheduled-slack"
			)
		}

		return apiSuccess({
			shift,
			ticketsProcessed: tickets.length,
			message_ts: result.messageTs,
			sentAt: new Date().toISOString(),
		})
	} catch (error: unknown) {
		return handleApiError(error, "POST /api/scheduled-slack")
	}
}
