# Token-Effective Claude Ecosystem Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up persistent codebase indexing, structural codemaps, automated file-size warnings, and a feature scaffolding command so every Claude session starts with full structural knowledge and zero re-explanation overhead.

**Architecture:** claude-mem indexes the codebase into a persistent cross-session symbol database; three codemap files in `docs/CODEMAPS/` give in-session structural navigation without reading source files; a PostToolUse hook warns on file-size violations; a `/feature` command scaffolds new vertical slices in one shot.

**Tech Stack:** bash, python3 (stdlib), Claude Code hooks (PostToolUse), claude-mem smart-explore skill, JSON (settings.local.json)

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `.claude/hooks/check-file-size.sh` | Hook script: reads stdin JSON, checks line count vs limit |
| Modify | `.claude/settings.local.json` | Add `hooks.PostToolUse` wiring |
| Create | `docs/CODEMAPS/services.md` | Service layer structural map |
| Create | `docs/CODEMAPS/api-routes.md` | All API endpoints map |
| Create | `docs/CODEMAPS/components.md` | Component tree map |
| Create | `.claude/commands/feature.md` | `/feature` scaffolding slash command |
| Modify | `CLAUDE.md` | Add codemaps reference section |

---

## Task 1: Index Codebase with claude-mem

**Files:** (no file changes — persistent database write)

- [ ] **Step 1: Invoke claude-mem smart-explore**

Use the Skill tool to invoke `claude-mem:smart-explore`. Follow its instructions to index the full codebase. Target directories: `app/`, `server/`, `lib/`, `components/`, `hooks/`, `schemas/`, `interfaces/`, `enums/`.

- [ ] **Step 2: Verify indexing worked**

Run a test search using `mcp__plugin_claude-mem_mcp-search__smart_search` with query `"TicketService"`. Expected: returns the class location and public methods without reading any source file.

- [ ] **Step 3: Run a second test search**

Search for `"handover-send route"`. Expected: returns `app/api/handover-send/route.ts` with its handler signature.

- [ ] **Step 4: Commit note**

```bash
git add -A
git commit -m "chore: index codebase into claude-mem for cross-session memory"
```

---

## Task 2: Create File-Size Hook Script

**Files:**
- Create: `.claude/hooks/check-file-size.sh`

- [ ] **Step 1: Write the hook script**

Create `.claude/hooks/check-file-size.sh` with this exact content:

```bash
#!/bin/bash
# PostToolUse hook: warn when a written/edited file exceeds its type line limit.
# Claude Code passes tool context as JSON on stdin.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('file_path', ''))
except Exception:
    print('')
" 2>/dev/null)

[ -z "$FILE_PATH" ] && exit 0
[ ! -f "$FILE_PATH" ] && exit 0

LINES=$(wc -l < "$FILE_PATH" | tr -d ' ')
LIMIT=0
LABEL=""

if [[ "$FILE_PATH" =~ /app/api/.+/route\.ts$ ]]; then
  LIMIT=80; LABEL="API route"
elif [[ "$FILE_PATH" =~ /server/services/.+\.ts$ ]]; then
  LIMIT=250; LABEL="Service"
elif [[ "$FILE_PATH" =~ /server/repository/.+\.ts$ ]]; then
  LIMIT=200; LABEL="Repository"
elif [[ "$FILE_PATH" =~ /components/.+\.tsx?$ ]]; then
  LIMIT=200; LABEL="Component"
elif [[ "$FILE_PATH" =~ /hooks/.+\.ts$ ]]; then
  LIMIT=100; LABEL="Hook"
elif [[ "$FILE_PATH" =~ /lib/.+\.ts$ ]]; then
  LIMIT=150; LABEL="Utility"
fi

if [ "$LIMIT" -gt 0 ] && [ "$LINES" -gt "$LIMIT" ]; then
  echo "⚠️  File size warning: $(basename "$FILE_PATH") is $LINES lines (limit: $LIMIT for $LABEL). Consider splitting."
fi

exit 0
```

- [ ] **Step 2: Make executable**

```bash
chmod +x ".claude/hooks/check-file-size.sh"
```

- [ ] **Step 3: Smoke test with a known large service file**

```bash
# Simulate what the hook receives for a known file
echo '{"tool_input": {"file_path": "/Users/rithytep/SIDE PROJECT/jira-slack-integration/server/services/slack-messaging.service.ts"}}' \
  | bash ".claude/hooks/check-file-size.sh"
```

Expected: either prints a warning or no output (depending on file size). No error exit code.

- [ ] **Step 4: Test with a route file path**

```bash
echo '{"tool_input": {"file_path": "/Users/rithytep/SIDE PROJECT/jira-slack-integration/app/api/handover-send/route.ts"}}' \
  | bash ".claude/hooks/check-file-size.sh"
```

Expected: no crash, either warning or silence.

- [ ] **Step 5: Commit**

```bash
git add .claude/hooks/check-file-size.sh
git commit -m "chore: add PostToolUse file-size warning hook script"
```

---

## Task 3: Wire Hook into settings.local.json

**Files:**
- Modify: `.claude/settings.local.json`

- [ ] **Step 1: Read the current file**

Read `.claude/settings.local.json` to see its current structure before editing.

- [ ] **Step 2: Add the hooks section**

Add a `"hooks"` key at the top level of the JSON object (alongside `"permissions"` and `"outputStyle"`):

```json
"hooks": {
  "PostToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [
        {
          "type": "command",
          "command": "bash \".claude/hooks/check-file-size.sh\"",
          "timeout": 5
        }
      ]
    }
  ]
}
```

The final file should have three top-level keys: `permissions`, `outputStyle`, `hooks`. Do not remove any existing content from `permissions.allow`.

- [ ] **Step 3: Verify JSON is valid**

```bash
python3 -m json.tool ".claude/settings.local.json" > /dev/null && echo "✅ Valid JSON" || echo "❌ Invalid JSON"
```

Expected: `✅ Valid JSON`

- [ ] **Step 4: Commit**

```bash
git add .claude/settings.local.json
git commit -m "chore: wire PostToolUse file-size warning hook in project settings"
```

---

## Task 4: Create docs/CODEMAPS/services.md

**Files:**
- Create: `docs/CODEMAPS/services.md`

- [ ] **Step 1: Explore server/services/ to get all public method signatures**

For each `.ts` file in `server/services/` (excluding `index.ts` and `__tests__/`), read the file and extract:
- Class name
- All `public` or `async` methods (name + parameters + return type)
- Any exported types from the file

Also check `lib/services/` for additional utility services.

- [ ] **Step 2: Write docs/CODEMAPS/services.md**

Use this exact format for every service. Replace the entries below with actual content from Step 1:

```markdown
# Service Layer Codemap

> Auto-maintained snapshot. Update this file when adding/modifying any service.
> Last updated: 2026-04-09

---

## AIAutofillService
File: `server/services/ai-autofill.service.ts`
- `generateSuggestion(ticket: AIAutofillRequest["ticket"]): Promise<{ suggestion: AISuggestion; provider: string }>`
- `getFallbackSuggestion(): AISuggestion`

## BackupService
File: `server/services/backup.service.ts`
- `getAll(limit?: number): Promise<Backup[]>`
- `getAllItems(limit?: number): Promise<BackupItem[]>`
- `getById(id: number): Promise<Backup | null>`
- `create(backupType: BackupType, description?: string): Promise<Backup>`
- `restore(backupId: number): Promise<boolean>`

## FeedbackService
File: `server/services/feedback.service.ts`
- `getAll(limit?: number): Promise<Feedback[]>`
- `getAllItems(limit?: number): Promise<IFeedbackItem[]>`
- `getById(id: number): Promise<Feedback | null>`
- `create(type: FeedbackType, title: string, description: string): Promise<Feedback>`
- `updateStatus(id: number, status: FeedbackStatus): Promise<Feedback | null>`
- `delete(id: number): Promise<boolean>`

## HandoverService
File: `server/services/handover.service.ts`
Exported types: `ScanAndReplyResult`
- `sendHandover(options): Promise<HandoverMessageResult>`  ← fill exact signature from file
- `scanAndReplyToHandover(options?): Promise<ScanAndReplyResult>`  ← fill exact signature from file

## ScheduledCommentService
File: `server/services/scheduled-comment.service.ts`
- `getAll(): Promise<ScheduledComment[]>`
- `getAllItems(): Promise<IScheduledCommentItem[]>`
- `getEnabled(): Promise<ScheduledComment[]>`
- `getById(id: number): Promise<ScheduledComment | null>`
- `create(options: CreateCommentOptions): Promise<ScheduledComment>`
- `update(options: UpdateCommentServiceOptions): Promise<ScheduledComment | null>`
- `delete(id: number): Promise<boolean>`
- `updateLastPosted(id: number): Promise<void>`

## SettingsService
File: `server/services/settings.service.ts`
- `getSchedulerEnabled(): Promise<boolean>`
- `setSchedulerEnabled(enabled: boolean): Promise<void>`
- `getTriggerTimes(): Promise<{ time1: string; time2: string }>`
- `setTriggerTimes(time1: string, time2: string): Promise<void>`
- `getCustomChannelId(): Promise<string | null>`
- `setCustomChannelId(value: string): Promise<void>`
- `getMemberMentions(): Promise<string | null>`

## SlackMessagingService
File: `server/services/slack-messaging.service.ts`
Exported types: `TicketMessageData`, `HandoverMessageResult`, `ThreadReplyResult`, `HandoverCheckResult`
- `postTicketSummary(...)` ← fill exact signature from file
- `postShiftHandover(...)` ← fill exact signature from file
- `postHandoverReply(...)` ← fill exact signature from file

## ThemeService
File: `server/services/theme.service.ts`
- `getAllThemes(): ThemeInfo[]`
- `getSelectedTheme(): Promise<Theme>`
- `setSelectedTheme(theme: Theme): Promise<void>`

## TicketService
File: `server/services/ticket.service.ts`
- `saveTicketData(tickets: Record<string, { status: string; action: string }>): Promise<void>`
- `loadTicketData(): Promise<Record<string, TicketData>>`
- `getTicketData(ticketKey: string): Promise<TicketData | null>`
- `deleteTicketData(ticketKey: string): Promise<boolean>`
```

**Important:** Replace every `← fill exact signature from file` placeholder by reading the actual file. The codemap must have zero placeholders when committed.

- [ ] **Step 3: Spot-check two entries against source**

Pick `TicketService` and `BackupService`. Verify the method signatures in the codemap match `server/services/ticket.service.ts` and `server/services/backup.service.ts` exactly.

- [ ] **Step 4: Commit**

```bash
git add docs/CODEMAPS/services.md
git commit -m "docs: add services codemap for token-efficient navigation"
```

---

## Task 5: Create docs/CODEMAPS/api-routes.md

**Files:**
- Create: `docs/CODEMAPS/api-routes.md`

- [ ] **Step 1: List all route directories**

```bash
ls "app/api/"
```

There are 40+ routes. For each directory, the route file is `app/api/<name>/route.ts`.

- [ ] **Step 2: For each route, extract: HTTP method, path, request shape, response shape, auth required**

Read each `route.ts` and note:
- Exported HTTP methods (`GET`, `POST`, `PUT`, `DELETE`)
- What the request body or query params look like (from Zod schemas or inline validation)
- What the response returns (from `apiSuccess(...)` call)
- Whether the route is in the public bypass list in `middleware.ts` (public paths: `/api/health`, `/api/cron`, `/api/slack/commands`, `/api/webhook-jira`)

- [ ] **Step 3: Write docs/CODEMAPS/api-routes.md**

Use this format for every route:

```markdown
# API Routes Codemap

> Auto-maintained snapshot. Update this file when adding/modifying any route.
> Last updated: 2026-04-09

---

## POST /api/handover-send
File: `app/api/handover-send/route.ts`
Auth: required
Request: `{ channelId?: string, tickets: Ticket[] }` (fill from actual file)
Response: `{ result: HandoverMessageResult }`

## POST /api/handover-reply
File: `app/api/handover-reply/route.ts`
Auth: required
Request: (fill from file)
Response: (fill from file)

## GET /api/health
File: `app/api/health/route.ts`
Auth: none (public)
Query: `?deep=true` for full check
Response: `{ status: "ok" | "error", ... }`

## POST /api/webhook-jira
File: `app/api/webhook-jira/route.ts`
Auth: none (public — Jira webhook)
Request: Jira webhook payload
Response: `{ received: true }`

... (continue for all 40+ routes)
```

Do not leave any route out. Do not leave placeholders — read each file.

- [ ] **Step 4: Commit**

```bash
git add docs/CODEMAPS/api-routes.md
git commit -m "docs: add API routes codemap for token-efficient navigation"
```

---

## Task 6: Create docs/CODEMAPS/components.md

**Files:**
- Create: `docs/CODEMAPS/components.md`

- [ ] **Step 1: List all components**

```bash
find components -name "*.tsx" | sort
```

- [ ] **Step 2: For each component file, extract: component name, props interface, which hook/service/store it uses**

Read each `.tsx` file and note the exported component function, its props type, and imports of hooks/services/stores (Zustand stores, tRPC hooks, custom hooks).

- [ ] **Step 3: Write docs/CODEMAPS/components.md**

Use this format:

```markdown
# Components Codemap

> Auto-maintained snapshot. Update this file when adding/modifying any component.
> Last updated: 2026-04-09

---

## DashboardClient
File: `components/dashboard-client.tsx`
Uses: `useTickets`, `useAppStore` (zustand)

## DashboardHeader
File: `components/dashboard-header.tsx`
Props: `{ title: string; onRefresh: () => void }`

## DashboardContent
File: `components/dashboard-content.tsx`
Uses: tRPC `tickets.getAll`

## TicketsTable
File: `components/tickets-table.tsx`
Props: `{ tickets: Ticket[]; ... }` (fill from file)
Uses: `useTicketFilters` hook

## ScheduledComments
File: `components/scheduled-comments.tsx`
Uses: tRPC `scheduledComments.*`

## CommandPalette
File: `components/command-palette.tsx`
Uses: `useCommandPalette` hook

... (continue for all components including subdirectories)
```

Skip pure UI primitives in `components/ui/` — those are shadcn/ui and don't need mapping.

- [ ] **Step 4: Commit**

```bash
git add docs/CODEMAPS/components.md
git commit -m "docs: add components codemap for token-efficient navigation"
```

---

## Task 7: Create /feature Scaffolding Command

**Files:**
- Create: `.claude/commands/feature.md`

- [ ] **Step 1: Write .claude/commands/feature.md**

Create `.claude/commands/feature.md` with this exact content:

````markdown
# Scaffold New Feature

Scaffold a complete vertical slice for a new feature following project conventions.

## Arguments
- `$ARGUMENTS` — feature name in kebab-case (e.g., `sla-breach`, `ticket-export`)

## Instructions

Take the feature name from `$ARGUMENTS`. Derive these naming variants:
- **kebab**: `$ARGUMENTS` as-is (e.g., `sla-breach`)
- **PascalCase**: capitalize each hyphen-separated segment (e.g., `SlaBreach`)
- **ServiceClass**: `${PascalCase}Service` (e.g., `SlaBreachService`)

### Step 1: Create `schemas/$ARGUMENTS.schema.ts`

```typescript
import { z } from "zod"

export const ${PascalCase}InputSchema = z.object({
  // TODO: define input fields
})

export const ${PascalCase}OutputSchema = z.object({
  // TODO: define output fields
})

export type ${PascalCase}Input = z.infer<typeof ${PascalCase}InputSchema>
export type ${PascalCase}Output = z.infer<typeof ${PascalCase}OutputSchema>
```

### Step 2: Create `server/services/$ARGUMENTS.service.ts`

```typescript
import { createLogger } from "@/lib/logger"
import type { ${PascalCase}Input, ${PascalCase}Output } from "@/schemas/$ARGUMENTS.schema"

const logger = createLogger("${PascalCase}")

export class ${ServiceClass} {
  async process(input: ${PascalCase}Input): Promise<${PascalCase}Output> {
    logger.info("Processing $ARGUMENTS", { input })
    // TODO: implement business logic
    throw new Error("Not implemented")
  }
}
```

### Step 3: Create `app/api/$ARGUMENTS/route.ts`

```typescript
import { ${ServiceClass} } from "@/server/services"
import { apiSuccess, badRequest, handleApiError } from "@/lib/api"
import { ${PascalCase}InputSchema } from "@/schemas/$ARGUMENTS.schema"

const service = new ${ServiceClass}()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = ${PascalCase}InputSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest(parsed.error.message)
    }
    const result = await service.process(parsed.data)
    return apiSuccess({ result })
  } catch (error) {
    return handleApiError(error, "POST /api/$ARGUMENTS")
  }
}
```

### Step 4: Update `server/services/index.ts`

Add this line in alphabetical order among the existing exports:

```typescript
export { ${ServiceClass} } from "./$ARGUMENTS.service"
```

### Step 5: Update codemaps

Add entries to:
- `docs/CODEMAPS/services.md` — new `## ${ServiceClass}` section
- `docs/CODEMAPS/api-routes.md` — new `## POST /api/$ARGUMENTS` section

### Step 6: Verify

- Check `app/api/$ARGUMENTS/route.ts` is under 80 lines
- Check `server/services/$ARGUMENTS.service.ts` is under 250 lines
- Check `schemas/$ARGUMENTS.schema.ts` is under 100 lines
- Run: `npm run build` — fix any TypeScript errors before marking done
````

- [ ] **Step 2: Dry-run test**

Invoke `/feature sla-breach` mentally and verify the command would produce:
- `schemas/sla-breach.schema.ts`
- `server/services/sla-breach.service.ts` with class `SlaBreachService`
- `app/api/sla-breach/route.ts`
- Addition to `server/services/index.ts`
- Addition to both codemaps

Confirm the PascalCase derivation is unambiguous in the command text.

- [ ] **Step 3: Commit**

```bash
git add .claude/commands/feature.md
git commit -m "chore: add /feature scaffolding command for new vertical slices"
```

---

## Task 8: Update CLAUDE.md and Final Commit

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Read CLAUDE.md**

Read the current `CLAUDE.md` to find where to insert the codemaps section.

- [ ] **Step 2: Add codemaps section**

Add this section after the "Architecture" section and before "Code Standards":

```markdown
## Structural Navigation (Token-Efficient)

Before reading source files, check these codemaps:

| Map | Location | Use it to find |
|-----|----------|----------------|
| Services | `docs/CODEMAPS/services.md` | Service class names, method signatures |
| API Routes | `docs/CODEMAPS/api-routes.md` | Endpoint paths, request/response shapes |
| Components | `docs/CODEMAPS/components.md` | Component hierarchy, props, hooks used |

**Cross-session memory:** Use `claude-mem:smart-explore` / `smart_search` for symbol lookup without reading source files.

**Update rule:** When adding or modifying a service, route, or component — update the relevant codemap in the same commit.
```

- [ ] **Step 3: Commit CLAUDE.md**

```bash
git add CLAUDE.md
git commit -m "docs: add structural navigation section pointing to codemaps"
```

- [ ] **Step 4: Final verification**

Run the full check to confirm all pieces are in place:

```bash
echo "=== Codemaps ===" && ls docs/CODEMAPS/
echo "=== Hook script ===" && ls -la .claude/hooks/
echo "=== Feature command ===" && ls .claude/commands/
echo "=== Hook in settings ===" && python3 -c "import json; d=json.load(open('.claude/settings.local.json')); print('hooks' in d and 'PostToolUse' in d['hooks'])"
```

Expected output:
```
=== Codemaps ===
api-routes.md  components.md  services.md
=== Hook script ===
-rwxr-xr-x  check-file-size.sh
=== Feature command ===
check-file-size.md  feature.md  new-api.md  refactor-check.md
=== Hook in settings ===
True
```

---

## Self-Review Checklist

- [x] **Spec coverage:** All four components from spec are covered (claude-mem: Task 1, hook: Tasks 2-3, codemaps: Tasks 4-6, /feature: Task 7, CLAUDE.md: Task 8)
- [x] **No placeholders in hook script** — full bash code provided
- [x] **No placeholders in feature command** — full TypeScript templates provided
- [x] **Codemap tasks correctly tell agent to fill in real content** — explicit "no placeholders" instruction in each codemap task
- [x] **Type consistency** — `${PascalCase}Input/Output` used consistently in feature command across schema, service, and route
- [x] **Hook script handles edge cases** — empty path, non-existent file both exit cleanly
- [x] **settings.local.json instruction** is additive, not destructive — explicitly says do not remove existing permissions
