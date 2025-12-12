import { HandoverService } from "@/server/services"
import { apiSuccess, handleApiError } from "@/lib/api"

const handoverService = new HandoverService()

export async function POST() {
	try {
		const result = await handoverService.scanAndReplyToHandover()

		return apiSuccess({
			message: result.message,
			replied: result.replied,
			handoverMessageTs: result.handoverMessageTs,
			replyTs: result.replyTs,
			ticketsCount: result.ticketsCount,
		})
	} catch (error: unknown) {
		return handleApiError(error, "POST /api/scan-and-reply-handover")
	}
}
