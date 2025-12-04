export interface Ticket {
  key: string;
  summary: string;
  status: string;
  assignee: string;
  assigneeAvatar: string | null;
  created: string;
  dueDate: string | null;
  issueType: string;
  wlMainTicketType: string;
  wlSubTicketType: string;
  customerLevel: string;
  jiraUrl: string;
  savedStatus: string;
  savedAction: string;
}

export interface TicketData {
  status: string;
  action: string;
  updated_at?: string;
}

export interface BackupItem {
  id: number;
  backup_type: "auto" | "manual";
  created_at: string;
  description: string | null;
  ticket_count: number;
  settings_count: number;
  comments_count: number;
}

export interface Backup {
  id: number;
  backup_type: "auto" | "manual";
  ticket_data: Record<string, TicketData> | null;
  app_settings: Record<string, string> | null;
  scheduled_comments: ScheduledComment[] | null;
  created_at: Date;
  description: string | null;
}

export interface ScheduledComment {
  id: number;
  comment_type: "jira" | "slack";
  ticket_key?: string;
  comment_text: string;
  cron_schedule: string;
  enabled: boolean;
  created_at?: Date;
  updated_at?: Date;
  last_posted_at?: Date | null;
}

export interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    status: { name: string };
    assignee?: {
      displayName: string;
      avatarUrls?: { "48x48"?: string };
    };
    created: string;
    duedate?: string;
    issuetype?: { name: string };
    [key: string]: any;
  };
}

export interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
    emoji?: boolean;
  };
  elements?: any[];
  accessory?: any;
  block_id?: string;
}

export interface SlackResponse {
  ok: boolean;
  error?: string;
  ts?: string;
  channel?: string;
  message?: any;
  messages?: any[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Feedback {
  id: number;
  type: "bug" | "feedback" | "suggestion" | "feature";
  title: string;
  description: string;
  created_at: Date;
  status: "new" | "reviewed" | "resolved" | "dismissed";
}

export type Theme = "default" | "christmas";

export interface ThemeInfo {
  id: Theme;
  name: string;
  description: string;
  icon: string;
}
