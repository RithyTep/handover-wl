import { BackupType } from "@/enums/backup.enum";
import type { TicketData } from "./ticket.interface";
import type { ScheduledComment } from "./scheduled-comment.interface";

export interface BackupItem {
  id: number;
  backup_type: BackupType;
  created_at: string;
  description: string | null;
  ticket_count: number;
  settings_count: number;
  comments_count: number;
}

export interface Backup {
  id: number;
  backup_type: BackupType;
  ticket_data: Record<string, TicketData> | null;
  app_settings: Record<string, string> | null;
  scheduled_comments: ScheduledComment[] | null;
  created_at: Date;
  description: string | null;
}
