# Jira-Slack Integration: Polling & Notification Infrastructure

## Overview
The project is a macOS menu bar app (LazyhandBar) + Next.js backend + Vercel deployment that polls Jira for tickets, displays them locally, and provides Slack integration.

---

## 1. macOS App Polling Infrastructure

### File Structure
```
LazyhandBar/
├── ViewModels/
│   ├── TicketListViewModel.swift    # Main polling orchestrator
│   ├── TicketDetailViewModel.swift  # Detail view state
│   └── AppViewModel.swift           # App-level state
├── Services/
│   ├── TicketAPIService.swift       # HTTP client to backend
│   ├── ConfigService.swift          # Config persistence
│   ├── NotificationPanel.swift      # Notification display
│   └── SchedulerService.swift       # Cron scheduling
└── Models/
    ├── AppConfig.swift              # Configuration model
    └── Ticket.swift                 # Ticket data model
```

### Polling Logic (TicketListViewModel.swift)

**Key Details:**
- **Polling Mechanism**: Timer.scheduledTimer with repeating interval
- **Polling Interval**: Configurable, default 30 seconds (from AppConfig.pollingInterval)
- **Initial Fetch**: Immediate on app startup, then periodic
- **New Ticket Detection**: Compares fetched ticket keys with known set
- **Notifications**: Plays sound + shows banner + updates widget on new tickets

**Code Flow:**
```swift
startBackgroundPolling(appUrl, interval) {
  1. Fetch tickets immediately
  2. Create Timer.scheduledTimer(interval: TimeInterval)
  3. On each tick: Task { await fetchTickets(config) }
  4. On new tickets: showNewTicketNotification()
}

fetchTickets(config) {
  1. Call apiService.fetchTickets(config: AppConfig)
  2. Detect new tickets via detectNewTickets()
  3. Update @Published vars (tickets, totalCount, lastFetchDate)
  4. Preload detail data in background
  5. Show notifications if new tickets found
}
```

### Configuration Storage

**Location**: ~/.lazyhand/config.json (UserDefaults-style JSON)

**AppConfig.swift Model**:
```swift
struct AppConfig: Codable {
    var appUrl: String                    // Backend URL (https://handover-production.rithytep.online)
    var token: String                     // Token (currently unused)
    var channelId: String                 // Slack channel
    var mentions: String                  // Slack mentions
    var preset: String                    // "day", "night", or "custom"
    var hour: String                      // Hour (0-23)
    var minute: String                    // Minute (0-59)
    var soundEnabled: String              // "true" / "false"
    var selectedSound: String             // "Tink" (default)
    var widgetEnabled: String             // "true" / "false"
    var pollingInterval: String           // Seconds (default "30")
    
    // Computed properties:
    var pollingIntervalSeconds: TimeInterval { TimeInterval(Int(pollingInterval) ?? 30) }
    var trimmedAppUrl: String { /* removes trailing / */ }
}
```

**Polling Interval Configuration**:
- Loaded from AppConfig.pollingInterval (string, converted to TimeInterval)
- Default: 30 seconds
- Can be changed via app settings
- Applies on next app restart (startBackgroundPolling called during init)

---

## 2. Next.js API Endpoints (Backend)

### Core Ticket Endpoints

#### GET /api/tickets
**File**: `/app/api/tickets/route.ts`

```typescript
export async function GET() {
  // Calls service layer
  const savedData = await loadTicketData();  // From PostgreSQL
  const tickets = await getTicketsWithSavedData(savedData);  // Fetch from Jira + merge saved data
  return { success: true, tickets, total, storage: "postgresql" }
}
```

**Returns**: Array of transformed Ticket objects with saved status/action data merged in

#### GET /api/ticket-comments?key={ticketKey}
**File**: `/app/api/ticket-comments/route.ts`

```typescript
const comments = await fetchTicketComments(key);  // Calls Jira service
return { success: true, comments };
```

#### GET /api/ticket-transitions?key={ticketKey}
**File**: `/app/api/ticket-transitions/route.ts`

```typescript
const transitions = await fetchTransitions(key);  // Calls Jira service
return { success: true, transitions };
```

#### POST /api/transition-ticket
**File**: `/app/api/transition-ticket/route.ts`

- Body: { ticket_key, transition_id }
- Calls Jira service to transition issue
- Returns success/error

#### POST /api/post-jira-comment
**File**: `/app/api/post-jira-comment/route.ts`

- Body: { ticket_key, comment_text, scheduled_comment_id? }
- Rate limit: 20 requests per 60 seconds (by IP)
- Calls Jira service to post comment
- Updates last_posted_at if scheduled_comment_id provided

#### POST /api/upload-attachment
- Multipart form upload to Jira
- Body: file + ticket_key

#### GET /api/jira-image?url={url} or id={id}&type={thumbnail|content}
- Proxy for Jira image resources (with auth headers)

---

## 3. Backend Service Layer (Jira Integration)

### Jira Service (lib/services/jira.ts)

**Authentication**:
```typescript
// Basic Auth header
const authHeader = Buffer.from(`${email}:${apiToken}`).toString("base64")
headers.Authorization = `Basic ${authHeader}`
```

**Jira Configuration**:
- **Base URL**: env.JIRA_URL (from .env)
- **Email**: env.JIRA_EMAIL
- **API Token**: env.JIRA_API_TOKEN
- **Timeout**: 30 seconds (TIMEOUTS.JIRA)

**Jira API Endpoints Used**:
1. `POST /rest/api/3/search/jql` - Search issues with JQL
2. `GET /rest/api/3/issue/{key}/comment?expand=renderedBody` - Fetch comments (v2 API)
3. `GET /rest/api/3/issue/{key}/transitions` - Get available transitions
4. `POST /rest/api/3/issue/{key}/transitions` - Transition issue
5. `POST /rest/api/3/issue/{key}/comment` - Post comment
6. `GET /rest/api/3/issue/{key}?fields=attachment` - Get attachments
7. `GET /rest/api/3/attachment/thumbnail/{id}` - Get attachment thumbnail
8. `GET /rest/api/3/attachment/content/{id}` - Get attachment content
9. `POST /rest/api/3/issue/{key}/attachments` - Upload attachment
10. `GET /rest/api/3/myself` - Health check

**Ticket Fetch Logic**:
```typescript
export async function fetchTickets(jql = JQL_QUERY, maxResults = 100) {
  const response = await axios.post(
    `${baseUrl}/rest/api/3/search/jql`,
    { jql, maxResults, fields: JIRA_FIELDS },
    { headers: createHeaders(), timeout: 30000 }
  );
  return response.data.issues;
}

// Then transform each issue
export function transformIssue(issue, savedData?) {
  return {
    key: issue.key,
    summary: issue.fields.summary,
    status: issue.fields.status.name,
    assignee: issue.fields.assignee?.displayName || "Unassigned",
    assigneeAvatar: issue.fields.assignee?.avatarUrls["48x48"],
    created: issue.fields.created,
    dueDate: issue.fields.duedate,
    issueType: issue.fields.issuetype?.name,
    wlMainTicketType: issue.fields[customfield_10451]?.value,
    wlSubTicketType: issue.fields[customfield_10453]?.value,
    customerLevel: issue.fields[customfield_10400],
    jiraUrl: `${baseUrl}/browse/${key}`,
    savedStatus: savedData?.status || "--",
    savedAction: savedData?.action || "--",
  };
}
```

---

## 4. Jira Configuration (lib/config/index.ts)

```typescript
export const JIRA = {
  PROJECT_KEY: "TCP",
  MAX_RESULTS: 100,
  FIELDS: {
    WL_MAIN_TICKET_TYPE: "customfield_10451",
    WL_SUB_TICKET_TYPE: "customfield_10453",
    CUSTOMER_LEVEL: "customfield_10400",
  },
};

export const JQL_QUERY = `
project = TCP
AND issuetype in standardIssueTypes()
AND status in ("WL - Pending", "WL - Processing")
AND "Release Date[Date]" = EMPTY
ORDER BY created ASC, updated DESC
`;

export const JIRA_FIELDS = [
  "key", "summary", "status", "assignee", "created", "duedate",
  "issuetype", "customfield_10451", "customfield_10453", "customfield_10400"
];

export const TIMEOUTS = { JIRA: 30000, SLACK: 30000 };
```

---

## 5. Scheduling & Cron Infrastructure

### Vercel Cron Configuration

**File**: `vercel.json`
```json
{
  "regions": ["sin1"],
  "crons": [
    { "path": "/api/cron?task=backup", "schedule": "0 0 * * *" }
  ]
}
```

- **Only 1 hard-coded cron**: Daily backup at midnight UTC
- No dynamic cron scheduling at Vercel level

### Dynamic Scheduling via /api/cron Endpoint

**File**: `/app/api/cron/route.ts`

**Supported Tasks**:
1. `task=shift` - Run shift handover (evening/night)
2. `task=backup` - Backup all data
3. `task=handover` - Handover reply task

**How "Shift" Works** (the polling-like mechanism):
```
Vercel cron hits /api/cron?task=shift every minute (via external service)
→ Fetches configured trigger times from database (getTriggerTimes)
→ Gets current time in Asia/Bangkok timezone
→ If current time matches time1 → run evening shift
→ If current time matches time2 → run night shift
→ Otherwise → skip silently
```

**Trigger Time Storage**:
- Stored in PostgreSQL `app_settings` table
- Keys: `trigger_time_1` (evening, default 17:10), `trigger_time_2` (night, default 22:40)
- Configurable via `/api/trigger-times` endpoint (GET/POST)
- No app redeploy needed to change times

---

## 6. Database Setup (PostgreSQL + Prisma)

### Prisma Schema (prisma/schema.prisma)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model TicketData {
  ticketKey String @id @db.VarChar(50)
  status String @default("--")
  action String @default("--")
  updatedAt DateTime @default(now())
  @@map("ticket_data")
}

model AppSetting {
  key String @id @db.VarChar(100)
  value String @db.Text
  updatedAt DateTime @default(now())
  @@map("app_settings")
}

model ScheduledComment {
  id Int @id @default(autoincrement())
  commentType String @default("jira")
  ticketKey String? @db.VarChar(50)
  commentText String @db.Text
  cronSchedule String @db.VarChar(100)
  enabled Boolean @default(true)
  lastPostedAt DateTime?
  @@map("scheduled_comments")
}

model Backup {
  id Int @id @default(autoincrement())
  backupType String @default("auto")
  ticketData Json?
  appSettings Json?
  scheduledComments Json?
  createdAt DateTime @default(now())
  description String?
  @@map("backups")
}
```

### Database Config (lib/env.ts)

```typescript
function getDatabaseConfig() {
  const dbUrl = new URL(env.DATABASE_URL);
  return {
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port || "5432"),
    database: dbUrl.pathname.slice(1),
    user: dbUrl.username,
    password: dbUrl.password,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    max: isProduction ? 3 : 2,  // Serverless optimization
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
  };
}
```

**Optimization**: Serverless-optimized with max 3 connections in prod, short timeouts

---

## 7. Environment Configuration (lib/env.ts)

```typescript
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  APP_URL: z.string().url(),
  PORT: z.coerce.number().positive().default(3000),
  
  DATABASE_URL: z.string().url(),
  DATABASE_PUBLIC_URL: z.string().url().optional(),
  
  JIRA_URL: z.string().url(),
  JIRA_EMAIL: z.string().email(),
  JIRA_API_TOKEN: z.string().min(1),
  
  SLACK_BOT_TOKEN: z.string().optional(),
  SLACK_USER_TOKEN: z.string().optional(),
  SLACK_WEBHOOK_URL: z.string().url().optional(),
  SLACK_CHANNEL_ID: z.string().optional(),
  SLACK_SIGNING_SECRET: z.string().optional(),
  
  GROQ_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  AI_PROVIDER: z.enum(["groq", "openai"]).default("groq"),
  
  SCHEDULE_ENABLED: z.string().default("false").transform(val => val === "true"),
  CRON_SECRET: z.string().optional(),
  
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});
```

---

## 8. Data Flow Summary

### macOS App → Backend → Jira

```
┌─────────────────────────────────────────────┐
│  LazyhandBar macOS App                      │
│  ┌─────────────────────────────────────────┐│
│  │ TicketListViewModel                     ││
│  │ • Timer.scheduledTimer(30s interval)    ││
│  │ • startBackgroundPolling()              ││
│  │ • detectNewTickets()                    ││
│  │ • showNewTicketNotification()           ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
              ↓ (URLSession GET)
┌─────────────────────────────────────────────┐
│  Next.js Backend (Vercel)                   │
│  ┌─────────────────────────────────────────┐│
│  │ GET /api/tickets                        ││
│  │ GET /api/ticket-comments?key=X          ││
│  │ GET /api/ticket-transitions?key=X       ││
│  │ POST /api/transition-ticket             ││
│  │ POST /api/post-jira-comment             ││
│  └─────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────┐│
│  │ Service Layer (jira.ts)                 ││
│  │ • fetchTickets() → /api/3/search/jql    ││
│  │ • fetchTicketComments()                 ││
│  │ • fetchTransitions()                    ││
│  │ • postComment()                         ││
│  │ • uploadAttachment()                    ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
              ↓ (Axios HTTP Basic Auth)
┌─────────────────────────────────────────────┐
│  Jira Cloud (TCP project)                   │
│  • /rest/api/3/search/jql                   │
│  • /rest/api/3/issue/{key}/...              │
│  • Status: "WL - Pending", "WL - Processing"│
└─────────────────────────────────────────────┘

Database Layer:
└─ PostgreSQL (via Prisma)
   • ticket_data (saved status/action)
   • app_settings (trigger times, scheduler state)
   • scheduled_comments
   • backups
```

---

## 9. Webhook/Real-time Infrastructure

**Current Status**: NONE implemented

The architecture is **purely polling-based**:
- macOS app polls every 30 seconds
- No Jira webhooks configured
- No WebSocket connections
- No Server-Sent Events (SSE)
- No Slack event subscriptions for real-time updates

---

## 10. Key Files Reference

| File | Purpose |
|------|---------|
| `LazyhandBar/LazyhandBar/ViewModels/TicketListViewModel.swift` | Main polling orchestrator |
| `LazyhandBar/LazyhandBar/Services/TicketAPIService.swift` | HTTP client to backend |
| `LazyhandBar/LazyhandBar/Services/ConfigService.swift` | Config persistence |
| `LazyhandBar/LazyhandBar/Models/AppConfig.swift` | Configuration model |
| `app/api/tickets/route.ts` | Main GET endpoint for tickets |
| `app/api/ticket-comments/route.ts` | GET comments |
| `app/api/ticket-transitions/route.ts` | GET transitions |
| `app/api/transition-ticket/route.ts` | POST to transition |
| `app/api/post-jira-comment/route.ts` | POST comment (with rate limit) |
| `app/api/cron/route.ts` | Shift scheduling via minute-level checks |
| `app/api/trigger-times/route.ts` | GET/POST trigger times config |
| `lib/services/jira.ts` | Jira API client |
| `lib/services/database.ts` | Database operations |
| `lib/config/index.ts` | Jira config (JQL, fields, timeouts) |
| `lib/env.ts` | Environment variable schemas |
| `prisma/schema.prisma` | Database models |
| `vercel.json` | Vercel cron schedule (only daily backup) |
| `next.config.js` | Next.js config |
| `package.json` | Dependencies (Prisma, Axios, etc) |

---

## 11. Key Insights for WebSocket/Real-time Upgrade

1. **No webhook dependencies** - Safe to add without breaking existing code
2. **Polling interval**: 30 seconds in macOS app, fully configurable
3. **Cron timing**: Shift notifications use minute-level precision checks against database
4. **Database**: PostgreSQL with Prisma, can easily add new tables for WebSocket subscriptions
5. **Jira integration**: Uses Basic Auth, no OAuth token refresh needed
6. **Slack integration**: Already has message/command handlers, can extend for events
