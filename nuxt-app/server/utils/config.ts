export const JIRA = {
  PROJECT_KEY: 'TCP',
  MAX_RESULTS: 100,
  FIELDS: {
    WL_MAIN_TICKET_TYPE: 'customfield_10451',
    WL_SUB_TICKET_TYPE: 'customfield_10453',
    CUSTOMER_LEVEL: 'customfield_10400',
    RELEASE_DATE: 'customfield_11412',
  },
} as const

export const JQL_QUERY = `
project = ${JIRA.PROJECT_KEY}
AND issuetype in standardIssueTypes()
AND status in ("WL - Pending", "WL - Processing")
ORDER BY created ASC, updated DESC
`.trim()

export const JIRA_FIELDS = [
  'key',
  'summary',
  'status',
  'assignee',
  'created',
  'duedate',
  'issuetype',
  JIRA.FIELDS.WL_MAIN_TICKET_TYPE,
  JIRA.FIELDS.WL_SUB_TICKET_TYPE,
  JIRA.FIELDS.CUSTOMER_LEVEL,
  JIRA.FIELDS.RELEASE_DATE,
] as const

export const TIMEZONE = {
  NAME: 'Asia/Bangkok',
  OFFSET: 'GMT+7',
} as const

export const SCHEDULER = {
  DEFAULT_TIME_1: '17:10',
  DEFAULT_TIME_2: '22:40',
} as const

export const TIMEOUTS = {
  SLACK: 30000,
  JIRA: 30000,
} as const

export const BACKUP = {
  MAX_COUNT: 24,
  FETCH_LIMIT: 50,
} as const

export const CACHE = {
  TAGS: {
    TICKETS: 'tickets',
    DASHBOARD: 'dashboard',
    BACKUPS: 'backups',
  },
  EXPIRE_NOW: { expire: 0 },
} as const
