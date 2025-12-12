# Architecture Guide

## Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                              │
│  React Components + Zustand Stores + TanStack Query          │
│  /components/  /hooks/  /lib/stores/                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    API LAYER                                 │
│  Next.js API Routes + tRPC Routers                          │
│  /app/api/  /server/trpc/routers/                           │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                  SERVICE LAYER                               │
│  Business Logic + External Integrations                      │
│  /server/services/  /lib/services/                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                REPOSITORY LAYER                              │
│  Data Access Abstraction (Prisma Wrapper)                   │
│  /server/repository/                                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                  DATA LAYER                                  │
│  PostgreSQL via Prisma ORM                                   │
│  /prisma/schema.prisma                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Repository Pattern

### Location: `/server/repository/`

Repositories abstract database access from business logic.

| Repository | Entity | Purpose |
|------------|--------|---------|
| `ticket.repository.ts` | TicketData | Ticket CRUD operations |
| `settings.repository.ts` | AppSetting | Key-value settings |
| `scheduled-comment.repository.ts` | ScheduledComment | Scheduled posts |
| `backup.repository.ts` | Backup | Backup snapshots |
| `feedback.repository.ts` | Feedback | User feedback |
| `theme.repository.ts` | Theme | Theme preferences |
| `database.repository.ts` | - | DB init, health checks |

### Pattern Example:
```typescript
// Domain type conversion (snake_case DB → camelCase domain)
function toDomain(row: PrismaTicketData): TicketRow {
  return { ticket_key: row.ticketKey, status: row.status, ... }
}

export class TicketRepository {
  async findAll(): Promise<TicketRow[]>
  async findByKey(ticketKey: string): Promise<TicketRow | null>
  async upsert(data: TicketRow): Promise<TicketRow>
  async delete(ticketKey: string): Promise<boolean>
}
```

---

## Service Layer

### Location: `/server/services/`

Services contain business logic and orchestrate repository calls.

| Service | Repository | Purpose |
|---------|------------|---------|
| `ticket.service.ts` | TicketRepository | Ticket business logic |
| `settings.service.ts` | SettingsRepository | Settings management |
| `scheduled-comment.service.ts` | ScheduledCommentRepository | Comment scheduling |
| `backup.service.ts` | BackupRepository | Backup orchestration |
| `feedback.service.ts` | FeedbackRepository | Feedback handling |
| `theme.service.ts` | ThemeRepository | Theme management |

### Integration Services: `/lib/services/`

| Service | Purpose |
|---------|---------|
| `jira.ts` | Jira API client (fetchTickets, postComment) |
| `slack.ts` | Slack API client (postMessage, getHistory) |
| `database.ts` | Legacy database functions (604 lines - needs refactoring) |

---

## API Layer

### REST API Routes: `/app/api/`

27 route handlers organized by feature:

**Data Management:**
- `GET /api/tickets` - Fetch all tickets from Jira
- `POST /api/save` - Save ticket data to DB
- `GET /api/ticket_data.json` - Get saved ticket data

**Slack Integration:**
- `POST /api/send-slack` - Send message to Slack
- `POST /api/slack-thread` - Handle thread operations
- `POST /api/post-slack-thread` - Reply to thread
- `POST /api/scheduled-slack` - Scheduled Slack messages
- `POST /api/scan-and-reply-handover` - Auto-reply to handovers

**Jira Integration:**
- `POST /api/post-jira-comment` - Post comment to Jira
- `POST /api/ai-autofill` - AI-powered autofill (450 lines!)

**Scheduling:**
- `GET/POST /api/scheduled-comments` - Manage scheduled comments
- `GET/POST /api/trigger-times` - Set trigger times
- `POST /api/trigger-schedule` - Trigger scheduled tasks
- `GET/POST /api/scheduler-state` - Scheduler state

**Other:**
- `GET /api/health` - Multi-service health check
- `POST /api/backup` - Create backup
- `POST /api/backup/restore` - Restore backup
- `POST /api/feedback` - Submit feedback
- `POST /api/challenge` - Security challenge

### tRPC Routes: `/server/trpc/`

Type-safe RPC with automatic type inference:

```typescript
// server.ts - tRPC initialization
export const publicProcedure = t.procedure.use(initDatabaseMiddleware)
export const protectedMutation = publicProcedure.use(validateChallengeMiddleware)

// routers/theme.router.ts
export const themeRouter = router({
  getAll: publicProcedure.query(() => themeService.getAll()),
  getSelected: publicProcedure.query(() => themeService.getSelected()),
  setSelected: protectedMutation.input(z.object({ theme: themeSchema }))
    .mutation(({ input }) => themeService.setSelected(input.theme)),
})
```

---

## Type System

### Zod Schemas: `/lib/types/`

Runtime validation + TypeScript inference:

```typescript
// ticket.ts
export const ticketDataSchema = z.object({
  status: z.string(),
  action: z.string(),
  updated_at: z.string().optional(),
})
export type TicketData = z.infer<typeof ticketDataSchema>
```

### Interfaces: `/interfaces/`

Request/Response DTOs:

```
/interfaces/
  /common/      - Database entity models
  /request/     - Request DTOs (ISaveTicketDataRequest, etc.)
  /response/    - Response DTOs (IApiResponse, IPaginatedResponse)
```

### Enums: `/enums/`

Domain constants:

```typescript
// theme.enum.ts
export enum Theme {
  DEFAULT = "default",
  CHRISTMAS = "christmas",
  PIXEL = "pixel",
  LUNAR = "lunar",
  CODING = "coding",
  CLASH = "clash",
  ANGKOR_PIXEL = "angkor_pixel",
}
```

---

## Configuration

### Environment: `/lib/env.ts`

Zod-validated environment variables:

```typescript
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  DATABASE_URL: z.string().url(),
  JIRA_URL: z.string().url(),
  JIRA_EMAIL: z.string().email(),
  JIRA_API_TOKEN: z.string().min(1),
  SLACK_BOT_TOKEN: z.string().optional(),
  // ...
})

export function getJiraConfig() { /* ... */ }
export function getSlackConfig() { /* ... */ }
export function getDatabaseConfig() { /* ... */ }
```

### Static Config: `/lib/config/index.ts`

```typescript
export const JIRA = {
  PROJECT_KEY: "TCP",
  MAX_RESULTS: 100,
  FIELDS: { /* custom field IDs */ },
} as const

export const TIMEZONE = { NAME: "Asia/Bangkok", OFFSET: "GMT+7" } as const
export const SCHEDULER = { DEFAULT_TIME_1: "17:10", DEFAULT_TIME_2: "22:40" } as const
export const BACKUP = { MAX_COUNT: 24, FETCH_LIMIT: 50 } as const
```

---

## Security

### Location: `/lib/security/`

Challenge-based validation for mutations:

1. **Challenge Token**: Server generates token with fingerprint
2. **Proof-of-Work**: Client computes PoW solution
3. **Nonce**: One-time use to prevent replay attacks
4. **Request Hash**: Integrity verification

```typescript
// Headers required for protected mutations
X-Challenge-Token: <token>
X-Challenge-Nonce: <nonce>
X-Challenge-POW: <pow-hash>
X-Challenge-POW-Input: <pow-input>
X-Challenge-Fingerprint: <fingerprint>
X-Challenge-Timestamp: <timestamp>
X-Challenge-Request-Hash: <hash>
```

---

## Data Flow Examples

### Ticket Save Flow:
```
User clicks Save → React Component → POST /api/save
  → TicketService.saveTicketData()
  → TicketRepository.upsertMany()
  → Prisma.ticketData.upsert()
  → PostgreSQL
```

### Theme Change Flow:
```
User selects theme → ThemeSelector → tRPC mutation
  → themeRouter.setSelected()
  → ThemeService.setSelected()
  → ThemeRepository.setSelected()
  → AppSetting table
```

### AI Autofill Flow:
```
User clicks AI Fill → POST /api/ai-autofill
  → fetchTicketHistory() (Jira API)
  → buildPromptContext()
  → getAIClient() (Groq/OpenAI)
  → Stream response to client
```
