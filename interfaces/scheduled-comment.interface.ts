import { CommentType } from "@/enums/comment.enum";

export interface ScheduledComment {
  id: number;
  comment_type: CommentType;
  ticket_key?: string;
  comment_text: string;
  cron_schedule: string;
  enabled: boolean;
  created_at?: Date;
  updated_at?: Date;
  last_posted_at?: Date | null;
}
