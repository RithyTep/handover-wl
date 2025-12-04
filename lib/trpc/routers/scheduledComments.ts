import { z } from "zod";
import { router, publicProcedure } from "../server";
import { getScheduledComments, createScheduledComment, updateScheduledComment, deleteScheduledComment } from "@/lib/services";

export const scheduledCommentsRouter = router({
  getAll: publicProcedure.query(async () => {
    const comments = await getScheduledComments();
    // Transform dates to strings for client
    const transformedComments = comments.map((c) => ({
      ...c,
      created_at: c.created_at ? (typeof c.created_at === 'string' ? c.created_at : c.created_at.toISOString()) : undefined,
      updated_at: c.updated_at ? (typeof c.updated_at === 'string' ? c.updated_at : c.updated_at.toISOString()) : undefined,
      last_posted_at: c.last_posted_at ? (typeof c.last_posted_at === 'string' ? c.last_posted_at : c.last_posted_at.toISOString()) : null,
    }));
    return { success: true, comments: transformedComments };
  }),

  create: publicProcedure
    .input(
      z.object({
        comment_type: z.enum(["jira", "slack"]).default("jira"),
        ticket_key: z.string().optional(),
        comment_text: z.string(),
        cron_schedule: z.string(),
        enabled: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const comment = await createScheduledComment(
        input.comment_type,
        input.comment_text,
        input.cron_schedule,
        input.enabled,
        input.ticket_key
      );
      return { success: true, comment };
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        comment_type: z.enum(["jira", "slack"]).optional(),
        ticket_key: z.string().optional(),
        comment_text: z.string().optional(),
        cron_schedule: z.string().optional(),
        enabled: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      if (!updateData.comment_type || !updateData.comment_text || !updateData.cron_schedule || updateData.enabled === undefined) {
        throw new Error("Missing required fields");
      }
      const comment = await updateScheduledComment(
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
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await deleteScheduledComment(input.id);
      return { success: true };
    }),
});
