import { FeedbackType } from "@/enums/feedback.enum";
import { FeedbackStatus } from "@/enums/feedback.enum";

export interface Feedback {
  id: number;
  type: FeedbackType;
  title: string;
  description: string;
  created_at: Date;
  status: FeedbackStatus;
}
