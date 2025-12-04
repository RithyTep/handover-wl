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
