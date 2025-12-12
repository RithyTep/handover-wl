# Refactoring Roadmap

## Current Issues Summary

| Issue | File | Lines | Problem |
|-------|------|-------|---------|
| Monolithic AI route | `/app/api/ai-autofill/route.ts` | 450 | AI logic, Jira calls, prompt construction mixed |
| Large health check | `/app/api/health/route.ts` | 214 | Complex multi-service logic in route |
| Complex handover | `/app/api/scan-and-reply-handover/route.ts` | 143 | Business logic in API route |
| Large database service | `/lib/services/database.ts` | 604 | Duplicates repository pattern |
| Large theme config | `/lib/theme/theme-config.ts` | 1029 | All 7 themes in single file |
| Inconsistent config access | Multiple routes | - | Mix of process.env and getters |

---

## Phase 1: Extract Services from API Routes

### 1.1 Create AI Autofill Service

**New file:** `/server/services/ai-autofill.service.ts`

Extract from `/app/api/ai-autofill/route.ts`:

```typescript
export class AIAutofillService {
  // AI provider factory (groq/openai)
  private getAIClient(provider: string): OpenAI

  // Jira history fetching
  async fetchTicketHistory(ticketKey: string): Promise<JiraComment[]>

  // ADF to plain text conversion
  extractCommentText(comment: AdfNode): string

  // Filter Rovo/bot comments
  filterBotComments(comments: JiraComment[]): JiraComment[]

  // Prompt construction
  buildPromptContext(ticket: Ticket, history: JiraComment[]): string

  // Main orchestration
  async generateSuggestion(ticket: Ticket): Promise<ReadableStream>
}
```

**Result:** Route 450 → ~40 lines

### 1.2 Create Slack Messaging Service

**New file:** `/server/services/slack-messaging.service.ts`

Consolidate from multiple routes:

```typescript
export class SlackMessagingService {
  // Post handover message
  async postHandoverMessage(tickets, channel, token, mentions?): Promise<string>

  // Post ticket summary
  async postTicketSummary(ticketData, ticketDetails, channel): Promise<void>

  // Post thread reply
  async postThreadReply(text, threadTs, channel, token): Promise<void>

  // Format ticket data into Slack message
  buildTicketMessage(tickets, shiftLabel?): string

  // Find latest handover message
  async findHandoverMessage(channel, token): Promise<Message | null>
}
```

**Routes affected:**
- `/app/api/send-slack/route.ts` (84 → ~25 lines)
- `/app/api/post-slack-thread/route.ts` (65 → ~20 lines)
- `/app/api/scheduled-slack/route.ts` (109 → ~25 lines)

### 1.3 Create Handover Service

**New file:** `/server/services/handover.service.ts`

Extract from `/app/api/scan-and-reply-handover/route.ts`:

```typescript
export class HandoverService {
  // Get token/mentions for shift
  getShiftConfig(shift: 'evening' | 'night'): ShiftConfig

  // Main handover logic
  async scanAndReplyToHandover(): Promise<HandoverResult>

  // Orchestrate handover
  async processHandover(shift: string): Promise<void>
}
```

**Result:** Route 143 → ~25 lines

---

## Phase 2: Consolidate Database Layer

### Problem
Two parallel database access patterns:
1. `/lib/services/database.ts` (604 lines) - Legacy functional
2. `/server/repository/` (8 repos) - Modern class-based

### Solution

**Step 1:** Extend `/server/services/settings.service.ts`:

```typescript
export class SettingsService {
  // Existing methods...

  // Add these:
  async getSchedulerEnabled(): Promise<boolean>
  async setSchedulerEnabled(enabled: boolean): Promise<void>
  async getTriggerTimes(): Promise<{time1: string, time2: string}>
  async setTriggerTimes(time1: string, time2: string): Promise<void>
  async getCustomChannelId(): Promise<string | null>
  async setCustomChannelId(id: string): Promise<void>
  async getMemberMentions(): Promise<string | null>
  async setMemberMentions(mentions: string): Promise<void>
}
```

**Step 2:** Transform `/lib/services/database.ts` into compatibility layer:

```typescript
// Re-export from services for backward compatibility
import { TicketService } from "@/server/services/ticket.service"
import { SettingsService } from "@/server/services/settings.service"

const ticketService = new TicketService()
const settingsService = new SettingsService()

// Backward-compatible exports
export const saveTicketData = (tickets) => ticketService.saveTicketData(tickets)
export const loadTicketData = () => ticketService.loadTicketData()
export const getSchedulerEnabled = () => settingsService.getSchedulerEnabled()
// ... etc
```

**Result:** 604 → ~100 lines (compatibility layer only)

---

## Phase 3: Standardize Configuration Access

### 3.1 Extend `/lib/env.ts`

Add AI configuration:

```typescript
// Add to envSchema
AI_PROVIDER: z.enum(["groq", "openai"]).default("groq"),

// Add new getter
export function getAIConfig() {
  return {
    provider: env.AI_PROVIDER || "groq",
    groqApiKey: env.GROQ_API_KEY,
    openaiApiKey: env.OPENAI_API_KEY,
  }
}
```

### 3.2 Update Routes

Replace all `process.env.*` with getter functions:

| Route | Replace With |
|-------|-------------|
| `/app/api/ai-autofill/route.ts` | `getAIConfig()`, `getJiraConfig()` |
| `/app/api/send-slack/route.ts` | `getSlackConfig()` |
| `/app/api/scheduled-slack/route.ts` | `getSlackConfig()` |
| `/app/api/scan-and-reply-handover/route.ts` | `getSlackConfig()` |

---

## Phase 4: Standardize Error Handling

### Create `/lib/api/response.ts`

```typescript
import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"

export function success<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, ...data }, { status })
}

export function error(message: string, status = 500): NextResponse {
  logger.api.error(message)
  return NextResponse.json({ success: false, error: message }, { status })
}

export function badRequest(message: string): NextResponse {
  return error(message, 400)
}

export function handleError(err: unknown, context: string): NextResponse {
  const message = err instanceof Error ? err.message : "Unknown error"
  logger.api.error(`${context}: ${message}`)
  return error(message, 500)
}
```

### Update All API Routes

```typescript
// Before
return NextResponse.json({ success: false, error: message }, { status: 500 })

// After
import { handleError } from "@/lib/api/response"
return handleError(error, "GET /api/scheduled-comments")
```

---

## Phase 5: Theme Separation

### Current State
Single file `/lib/theme/theme-config.ts` (1029 lines) with all 7 themes.

### Solution: Modular Theme Files

```
/lib/theme/
  index.ts                    # Re-exports
  types.ts                    # ThemeConfig, ThemeHeaderConfig types
  themes/
    default.ts               # defaultThemeConfig (~100 lines)
    pixel.ts                 # pixelThemeConfig (~150 lines)
    lunar.ts                 # lunarThemeConfig (~150 lines)
    christmas.ts             # christmasThemeConfig (~150 lines)
    coding.ts                # codingThemeConfig (~150 lines)
    clash.ts                 # clashThemeConfig (~150 lines)
    angkor-pixel.ts          # angkorPixelThemeConfig (~150 lines)
    index.ts                 # THEME_CONFIGS map
  utils.ts                   # getThemeConfig, getHeaderConfig
```

### Benefits
- Easy to add new themes
- Isolated theme maintenance
- Reduced cognitive load when editing

---

## Files to Create

| File | Purpose | Est. Lines |
|------|---------|------------|
| `/server/services/ai-autofill.service.ts` | AI autofill logic | ~250 |
| `/server/services/slack-messaging.service.ts` | Slack message operations | ~150 |
| `/server/services/handover.service.ts` | Handover orchestration | ~100 |
| `/lib/api/response.ts` | API response utilities | ~50 |
| `/lib/theme/themes/*.ts` | Individual theme configs | ~100-150 each |

## Files to Modify

| File | Change |
|------|--------|
| `/app/api/ai-autofill/route.ts` | Delegate to AIAutofillService |
| `/app/api/scan-and-reply-handover/route.ts` | Delegate to HandoverService |
| `/app/api/send-slack/route.ts` | Use SlackMessagingService |
| `/app/api/scheduled-slack/route.ts` | Use SlackMessagingService |
| `/lib/services/database.ts` | Convert to compatibility layer |
| `/server/services/settings.service.ts` | Add setting methods |
| `/lib/env.ts` | Add AI configuration getter |
| `/lib/theme/theme-config.ts` | Split into modules |

---

## Implementation Priority

1. **HIGH**: Phase 1 - Extract services from API routes (biggest impact)
2. **HIGH**: Phase 2 - Consolidate database layer (reduce duplication)
3. **MEDIUM**: Phase 3 - Standardize configuration access
4. **MEDIUM**: Phase 4 - Standardize error handling
5. **MEDIUM**: Phase 5 - Theme separation

---

## Expected Outcomes

| Metric | Before | After |
|--------|--------|-------|
| `/app/api/ai-autofill/route.ts` | 450 lines | ~40 lines |
| `/app/api/scan-and-reply-handover/route.ts` | 143 lines | ~25 lines |
| `/lib/services/database.ts` | 604 lines | ~100 lines |
| `/lib/theme/theme-config.ts` | 1029 lines | ~50 lines |
| Average API route size | ~150 lines | ~30 lines |
