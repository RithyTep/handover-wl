import { router, publicProcedure, protectedMutation } from "@/server/trpc/server"
import { FeedbackService } from "@/server/services/feedback.service"
import { feedbackCreateSchema } from "@/schemas/feedback.schema"

const feedbackService = new FeedbackService()

export const feedbackRouter = router({
	getAll: publicProcedure.query(async () => {
		const feedback = await feedbackService.getAllItems()
		return { success: true, feedback }
	}),

	create: protectedMutation
		.input(feedbackCreateSchema)
		.mutation(async ({ input }) => {
			const feedback = await feedbackService.create(
				input.type,
				input.title,
				input.description
			)
			return { success: true, data: feedback }
		}),
})
