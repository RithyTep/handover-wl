import axios from "axios";
import { JQL_QUERY, JIRA_FIELDS, JIRA } from "@/lib/config";
import type { Ticket, JiraIssue, TicketData } from "@/lib/types";

const { JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN } = process.env;

const getAuthHeader = (): string =>
  Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");

const createHeaders = () => ({
  Authorization: `Basic ${getAuthHeader()}`,
  Accept: "application/json",
  "Content-Type": "application/json",
});

export async function fetchTickets(
  jql: string = JQL_QUERY,
  maxResults: number = JIRA.MAX_RESULTS
): Promise<JiraIssue[]> {
  const response = await axios.post(
    `${JIRA_URL}/rest/api/3/search/jql`,
    { jql, maxResults, fields: JIRA_FIELDS },
    { headers: createHeaders() }
  );
  return response.data.issues;
}

type CustomField = { value?: string } | undefined;

export function transformIssue(
  issue: JiraIssue,
  savedData?: TicketData
): Ticket {
  const mainTicketType = issue.fields[JIRA.FIELDS.WL_MAIN_TICKET_TYPE] as CustomField;
  const subTicketType = issue.fields[JIRA.FIELDS.WL_SUB_TICKET_TYPE] as CustomField;
  const customerLevel = issue.fields[JIRA.FIELDS.CUSTOMER_LEVEL] as string | undefined;

  return {
    key: issue.key,
    summary: issue.fields.summary,
    status: issue.fields.status.name,
    assignee: issue.fields.assignee?.displayName || "Unassigned",
    assigneeAvatar: issue.fields.assignee?.avatarUrls?.["48x48"] || null,
    created: issue.fields.created,
    dueDate: issue.fields.duedate || null,
    issueType: issue.fields.issuetype?.name || "None",
    wlMainTicketType: mainTicketType?.value || "None",
    wlSubTicketType: subTicketType?.value || "None",
    customerLevel: customerLevel || "None",
    jiraUrl: `${JIRA_URL}/browse/${issue.key}`,
    savedStatus: savedData?.status || "--",
    savedAction: savedData?.action || "--",
  };
}

export async function getTicketsWithSavedData(
  savedData: Record<string, TicketData>
): Promise<Ticket[]> {
  const issues = await fetchTickets();
  return issues.map((issue) => transformIssue(issue, savedData[issue.key]));
}

export async function postComment(
  issueKey: string,
  comment: string
): Promise<boolean> {
  try {
    await axios.post(
      `${JIRA_URL}/rest/api/3/issue/${issueKey}/comment`,
      {
        body: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: comment }],
            },
          ],
        },
      },
      { headers: createHeaders() }
    );
    return true;
  } catch {
    return false;
  }
}

export interface JiraComment {
  author: {
    displayName: string;
    accountId: string;
  };
  body: {
    content?: Array<{
      content?: Array<{
        text?: string;
      }>;
    }>;
  };
  created: string;
}

function extractTextFromBody(body: JiraComment["body"]): string {
  if (!body?.content) return "";
  return body.content
    .flatMap((block) => block.content?.map((item) => item.text) || [])
    .filter(Boolean)
    .join(" ");
}

export async function fetchTicketComments(
  issueKey: string
): Promise<Array<{ author: string; text: string; created: string }>> {
  try {
    const response = await axios.get(
      `${JIRA_URL}/rest/api/3/issue/${issueKey}/comment`,
      { headers: createHeaders() }
    );

    const comments: JiraComment[] = response.data.comments || [];

    return comments.map((comment) => ({
      author: comment.author.displayName,
      text: extractTextFromBody(comment.body),
      created: comment.created,
    }));
  } catch {
    return [];
  }
}

export function getLatestWLTCComment(
  comments: Array<{ author: string; text: string; created: string }>
): { author: string; text: string } | null {
  // Filter comments from WL_TC users (not bots like "Ticket Summary Analyst")
  const wlTcComments = comments.filter((c) => {
    const authorLower = c.author.toLowerCase();
    return (
      authorLower.includes("_wl_") ||
      authorLower.includes("wl_tc") ||
      authorLower.includes("wl_am") ||
      authorLower.includes("wl_po")
    );
  });

  if (wlTcComments.length === 0) return null;

  // Return the latest one (comments are usually sorted by date)
  const latest = wlTcComments[wlTcComments.length - 1];
  return { author: latest.author, text: latest.text };
}
