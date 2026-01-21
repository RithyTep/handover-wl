import { HandoverService } from "@/server/services"
import { apiSuccess, handleApiError } from "@/lib/api"

const handoverService = new HandoverService()

export async function POST(request: Request) {
	try {
		const url = new URL(request.url)
		const manual = url.searchParams.get("manual") === "1"
		const result = await handoverService.scanAndReplyToHandover({
			allowWithoutScheduledComments: manual,
		})

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
