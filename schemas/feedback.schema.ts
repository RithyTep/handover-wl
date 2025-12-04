import { z } from "zod";
import { FeedbackType } from "@/enums/feedback.enum";

export const feedbackCreateSchema = z.object({
  type: z.nativeEnum(FeedbackType),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
});
