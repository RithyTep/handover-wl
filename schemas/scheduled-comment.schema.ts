import { z } from "zod";
import { CommentType } from "@/enums/comment.enum";

export const scheduledCommentCreateSchema = z.object({
  comment_type: z.nativeEnum(CommentType),
  comment_text: z.string(),
  cron_schedule: z.string(),
  enabled: z.boolean(),
  ticket_key: z.string().optional(),
});

export const scheduledCommentUpdateSchema = z.object({
  id: z.number(),
  comment_type: z.nativeEnum(CommentType),
  comment_text: z.string(),
  cron_schedule: z.string(),
  enabled: z.boolean(),
  ticket_key: z.string().optional(),
});

export const scheduledCommentDeleteSchema = z.object({
  id: z.number(),
});
