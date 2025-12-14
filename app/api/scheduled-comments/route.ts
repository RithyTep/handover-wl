import { NextRequest } from "next/server"
import {
	getScheduledComments,
	createScheduledComment,
	updateScheduledComment,
	deleteScheduledComment,
} from "@/lib/services"
import { apiSuccess, badRequest, handleApiError, serverError } from "@/lib/api"

export async function GET() {
	try {
		const comments = await getScheduledComments()
		return apiSuccess({ comments })
	} catch (error) {
		return handleApiError(error, "GET /api/scheduled-comments")
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const { comment_type = "jira", ticket_key, comment_text, cron_schedule, enabled = true } = body

		if (!comment_text || !cron_schedule) {
			return badRequest("Missing required fields: comment_text, cron_schedule")
		}
		if (comment_type === "jira" && !ticket_key) {
			return badRequest("ticket_key is required for Jira comments")
		}

		const comment = await createScheduledComment({
			commentType: comment_type,
			commentText: comment_text,
			cronSchedule: cron_schedule,
			enabled,
			ticketKey: ticket_key,
		})

		if (!comment) {
			return serverError("Failed to create scheduled comment")
		}
		return apiSuccess({ comment })
	} catch (error) {
		return handleApiError(error, "POST /api/scheduled-comments")
	}
}

export async function PUT(req: NextRequest) {
	try {
		const body = await req.json()
		const { id, comment_type = "jira", ticket_key, comment_text, cron_schedule, enabled } = body

		if (!id || !comment_text || !cron_schedule || enabled === undefined) {
			return badRequest("Missing required fields: id, comment_text, cron_schedule, enabled")
		}
		if (comment_type === "jira" && !ticket_key) {
			return badRequest("ticket_key is required for Jira comments")
		}

		const comment = await updateScheduledComment({
			id,
			commentType: comment_type,
			commentText: comment_text,
			cronSchedule: cron_schedule,
			enabled,
			ticketKey: ticket_key,
		})

		if (!comment) {
			return serverError("Failed to update scheduled comment")
		}
		return apiSuccess({ comment })
	} catch (error) {
		return handleApiError(error, "PUT /api/scheduled-comments")
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url)
		const id = searchParams.get("id")

		if (!id) {
			return badRequest("Missing required parameter: id")
		}

		const success = await deleteScheduledComment(parseInt(id))
		if (!success) {
			return serverError("Failed to delete scheduled comment")
		}
		return apiSuccess({ deleted: true })
	} catch (error) {
		return handleApiError(error, "DELETE /api/scheduled-comments")
	}
}
