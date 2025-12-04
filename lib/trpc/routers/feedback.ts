import { router, publicProcedure } from "@/server/trpc/server";
import { FeedbackService } from "@/server/services/feedback.service";
import { feedbackCreateSchema } from "@/schemas/feedback.schema";

const feedbackService = new FeedbackService();

export const feedbackRouter = router({
  getAll: publicProcedure.query(async () => {
    const feedback = await feedbackService.getAll();
    const transformedFeedback = feedback.map((f) => ({
      ...f,
      created_at: f.created_at instanceof Date ? f.created_at.toISOString() : String(f.created_at),
    }));
    return { success: true, feedback: transformedFeedback };
  }),

  create: publicProcedure
    .input(feedbackCreateSchema)
    .mutation(async ({ input }) => {
      const feedback = await feedbackService.create(input.type, input.title, input.description);
      return { success: true, data: feedback };
    }),
});
