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
    [key: string]: unknown;
  };
}
