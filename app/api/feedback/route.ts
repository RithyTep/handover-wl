import { NextRequest } from "next/server"
import { FeedbackService } from "@/server/services/feedback.service"
import { FeedbackType, FeedbackTypeValues } from "@/enums"
import { apiSuccess, badRequest, handleApiError } from "@/lib/api"
import { logger } from "@/lib/logger"

const log = logger.api
const feedbackService = new FeedbackService()

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { type, title, description } = body

		if (!type || !title || !description) {
			return badRequest("Missing required fields")
		}

		if (!FeedbackTypeValues.includes(type)) {
			return badRequest("Invalid feedback type")
		}

		const feedback = await feedbackService.create(type as FeedbackType, title, description)

		log.info("Feedback submitted", {
			id: feedback.id,
			type,
			title: title.substring(0, 50) + (title.length > 50 ? "..." : ""),
		})

		return apiSuccess({ id: feedback.id, message: "Feedback submitted successfully" })
	} catch (error) {
		return handleApiError(error, "POST /api/feedback")
	}
}

export async function GET() {
	try {
		const feedbacks = await feedbackService.getAllItems()
		return apiSuccess({ data: feedbacks })
	} catch (error) {
		return handleApiError(error, "GET /api/feedback")
	}
}
