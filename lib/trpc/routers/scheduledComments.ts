import { router, publicProcedure } from "@/server/trpc/server";
import { ScheduledCommentService } from "@/server/services/scheduled-comment.service";
import { scheduledCommentCreateSchema, scheduledCommentUpdateSchema, scheduledCommentDeleteSchema } from "@/schemas/scheduled-comment.schema";

const scheduledCommentService = new ScheduledCommentService();

export const scheduledCommentsRouter = router({
  getAll: publicProcedure.query(async () => {
    const comments = await scheduledCommentService.getAll();
    const transformedComments = comments.map((c) => ({
      ...c,
      created_at: c.created_at ? (typeof c.created_at === 'string' ? c.created_at : c.created_at.toISOString()) : undefined,
      updated_at: c.updated_at ? (typeof c.updated_at === 'string' ? c.updated_at : c.updated_at.toISOString()) : undefined,
      last_posted_at: c.last_posted_at ? (typeof c.last_posted_at === 'string' ? c.last_posted_at : c.last_posted_at.toISOString()) : null,
    }));
    return { success: true, comments: transformedComments };
  }),

  create: publicProcedure
    .input(scheduledCommentCreateSchema)
    .mutation(async ({ input }) => {
      const comment = await scheduledCommentService.create(
        input.comment_type,
        input.comment_text,
        input.cron_schedule,
        input.enabled,
        input.ticket_key
      );
      return { success: true, comment };
    }),

  update: publicProcedure
    .input(scheduledCommentUpdateSchema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      const comment = await scheduledCommentService.update(
        id,
        updateData.comment_type,
        updateData.comment_text,
        updateData.cron_schedule,
        updateData.enabled,
        updateData.ticket_key
      );
      return { success: true, comment };
    }),

  delete: publicProcedure
    .input(scheduledCommentDeleteSchema)
    .mutation(async ({ input }) => {
      await scheduledCommentService.delete(input.id);
      return { success: true };
    }),
});
