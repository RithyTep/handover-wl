import axios from 'axios'
import { getJiraConfig } from '../utils/env'
import { JIRA, JIRA_FIELDS, JQL_QUERY, TIMEOUTS } from '../utils/config'
import type { JiraComment, JiraIssue, Ticket, TicketData } from '~/types'

function getConfig() {
  return getJiraConfig()
}

function getAuthHeader(): string {
  const { email, apiToken } = getConfig()
  return Buffer.from(`${email}:${apiToken}`).toString('base64')
}

function createHeaders() {
  return {
    'Authorization': `Basic ${getAuthHeader()}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
}

export async function fetchTickets(
  jql: string = JQL_QUERY,
  maxResults: number = JIRA.MAX_RESULTS,
): Promise<JiraIssue[]> {
  const { baseUrl } = getConfig()

  try {
    const response = await axios.post(
      `${baseUrl}/rest/api/3/search/jql`,
      { jql, maxResults, fields: JIRA_FIELDS },
      { headers: createHeaders(), timeout: TIMEOUTS.JIRA },
    )

    console.log('[Jira] Tickets fetched', { count: response.data.issues?.length || 0 })
    return response.data.issues
  }
  catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Jira] Failed to fetch tickets', { error: message })
    throw error
  }
}

type CustomField = { value?: string } | undefined

function extractCustomFieldValue(
  fields: JiraIssue['fields'],
  fieldKey: string,
): string {
  const field = fields[fieldKey] as CustomField
  return field?.value || 'None'
}

function extractAssigneeInfo(assignee: JiraIssue['fields']['assignee']): {
  name: string
  avatar: string | null
} {
  return {
    name: assignee?.displayName || 'Unassigned',
    avatar: assignee?.avatarUrls?.['48x48'] || null,
  }
}

function extractSavedData(savedData?: TicketData): {
  status: string
  action: string
} {
  return {
    status: savedData?.status || '--',
    action: savedData?.action || '--',
  }
}

export function transformIssue(
  issue: JiraIssue,
  savedData?: TicketData,
): Ticket {
  const { baseUrl } = getConfig()
  const { fields, key } = issue
  const assignee = extractAssigneeInfo(fields.assignee)
  const saved = extractSavedData(savedData)

  return {
    key,
    summary: fields.summary,
    status: fields.status.name,
    assignee: assignee.name,
    assigneeAvatar: assignee.avatar,
    created: fields.created,
    dueDate: fields.duedate || null,
    releaseDate: (fields[JIRA.FIELDS.RELEASE_DATE] as string) || null,
    issueType: fields.issuetype?.name || 'None',
    wlMainTicketType: extractCustomFieldValue(fields, JIRA.FIELDS.WL_MAIN_TICKET_TYPE),
    wlSubTicketType: extractCustomFieldValue(fields, JIRA.FIELDS.WL_SUB_TICKET_TYPE),
    customerLevel: (fields[JIRA.FIELDS.CUSTOMER_LEVEL] as string) || 'None',
    jiraUrl: `${baseUrl}/browse/${key}`,
    savedStatus: saved.status,
    savedAction: saved.action,
  }
}

export async function getTicketsWithSavedData(
  savedData: Record<string, TicketData>,
): Promise<Ticket[]> {
  const issues = await fetchTickets()
  return issues.map(issue => transformIssue(issue, savedData[issue.key]))
}

export async function postComment(
  issueKey: string,
  comment: string,
): Promise<boolean> {
  const { baseUrl } = getConfig()
  console.log('[Jira] Posting comment', { issueKey })

  try {
    await axios.post(
      `${baseUrl}/rest/api/3/issue/${issueKey}/comment`,
      {
        body: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: comment }],
            },
          ],
        },
      },
      { headers: createHeaders(), timeout: TIMEOUTS.JIRA },
    )

    console.log('[Jira] Comment posted successfully', { issueKey })
    return true
  }
  catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Jira] Failed to post comment', { issueKey, error: message })
    return false
  }
}

function extractTextFromBody(body: JiraComment['body']): string {
  if (!body?.content) return ''
  return body.content
    .flatMap(block => block.content?.map(item => item.text) || [])
    .filter(Boolean)
    .join(' ')
}

export async function fetchTicketComments(
  issueKey: string,
): Promise<Array<{ author: string, text: string, created: string }>> {
  const { baseUrl } = getConfig()

  try {
    const response = await axios.get(
      `${baseUrl}/rest/api/3/issue/${issueKey}/comment`,
      { headers: createHeaders(), timeout: TIMEOUTS.JIRA },
    )

    const comments: JiraComment[] = response.data.comments || []

    return comments.map(comment => ({
      author: comment.author.displayName,
      text: extractTextFromBody(comment.body),
      created: comment.created,
    }))
  }
  catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Jira] Failed to fetch comments', { issueKey, error: message })
    return []
  }
}

export function getLatestWLTCComment(
  comments: Array<{ author: string, text: string, created: string }>,
): { author: string, text: string } | null {
  const wlTcComments = comments.filter((c) => {
    const authorLower = c.author.toLowerCase()
    return (
      authorLower.includes('_wl_')
      || authorLower.includes('wl_tc')
      || authorLower.includes('wl_am')
      || authorLower.includes('wl_po')
    )
  })

  if (wlTcComments.length === 0) return null

  const latest = wlTcComments[wlTcComments.length - 1]
  return { author: latest.author, text: latest.text }
}

export async function checkHealth(): Promise<{
  healthy: boolean
  latency: number
  error?: string
}> {
  const { baseUrl } = getConfig()
  const start = Date.now()

  try {
    await axios.get(`${baseUrl}/rest/api/3/myself`, {
      headers: createHeaders(),
      timeout: 5000,
    })

    return {
      healthy: true,
      latency: Date.now() - start,
    }
  }
  catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return {
      healthy: false,
      latency: Date.now() - start,
      error: message,
    }
  }
}
