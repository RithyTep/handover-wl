/**
 * Scheduled Slack API Route
 *
 * POST /api/scheduled-slack
 *
 * Posts shift handover messages to Slack with ticket information.
 * Supports evening and night shifts with different tokens and mentions.
 */

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

		// Validate shift parameter
		if (!shift || !["evening", "night"].includes(shift)) {
			return badRequest("Shift parameter (evening or night) is required")
		}

		// Get shift-specific configuration
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

		// Get channel
		const customChannelId = await getCustomChannelId()

		// Load tickets with saved data
		const savedData = await loadTicketData()
		const tickets = await getTicketsWithSavedData(savedData)

		// Convert to message data format
		const ticketData = slackMessaging.convertTicketsToMessageData(tickets)

		// Post handover message
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
