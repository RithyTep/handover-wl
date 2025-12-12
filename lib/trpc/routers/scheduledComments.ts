import { router, publicProcedure, protectedMutation } from "@/server/trpc/server"
import { ScheduledCommentService } from "@/server/services/scheduled-comment.service"
import {
	scheduledCommentCreateSchema,
	scheduledCommentUpdateSchema,
	scheduledCommentDeleteSchema,
} from "@/schemas/scheduled-comment.schema"

const scheduledCommentService = new ScheduledCommentService()

export const scheduledCommentsRouter = router({
	getAll: publicProcedure.query(async () => {
		const comments = await scheduledCommentService.getAllItems()
		return { success: true, comments }
	}),

	create: protectedMutation
		.input(scheduledCommentCreateSchema)
		.mutation(async ({ input }) => {
			const comment = await scheduledCommentService.create({
				commentType: input.comment_type,
				commentText: input.comment_text,
				cronSchedule: input.cron_schedule,
				enabled: input.enabled,
				ticketKey: input.ticket_key,
			})
			return { success: true, comment }
		}),

	update: protectedMutation
		.input(scheduledCommentUpdateSchema)
		.mutation(async ({ input }) => {
			const comment = await scheduledCommentService.update({
				id: input.id,
				commentType: input.comment_type,
				commentText: input.comment_text,
				cronSchedule: input.cron_schedule,
				enabled: input.enabled,
				ticketKey: input.ticket_key,
			})
			return { success: true, comment }
		}),

	delete: protectedMutation
		.input(scheduledCommentDeleteSchema)
		.mutation(async ({ input }) => {
			await scheduledCommentService.delete(input.id)
			return { success: true }
		}),
})
