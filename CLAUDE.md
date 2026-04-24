# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Jira Handover Dashboard** — A Next.js 16 full-stack app that synchronizes Jira tickets with Slack, supports AI-powered handover generation, scheduled comments, backup/restore, and a macOS companion app (`LazyhandBar`).

---

## Commands

```bash
# Development
npm install          # Install deps (runs prisma generate automatically)
npm run dev          # Start dev server on :3000
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix ESLint issues

# Build & Production
npm run build        # TypeScript + Next.js build (run before committing)
npm run start        # Start production server

# Database
npx prisma migrate dev       # Run migrations
npx prisma studio            # Open Prisma DB browser

# Testing
npm run test:run     # Run all tests once
npm test             # Watch mode
npm run test:coverage

# CLI tools
npm run handover             # Copy handover text to clipboard
npm run handover:send        # Send handover to Slack
```

---

## Architecture

### Tech Stack
- **Framework**: Next.js 16, React 19, TypeScript
- **Database**: PostgreSQL via Prisma ORM
- **API**: tRPC (type-safe) + REST (`/app/api/`)
- **UI**: shadcn/ui (Radix) + TailwindCSS
- **State**: Zustand + React Query (@tanstack)
- **Validation**: Zod (at API boundaries and env vars)
- **Scheduling**: node-cron for background tasks
- **AI**: OpenAI / Groq (optional, for autofill & handover replies)

### Actual Directory Layout
```
app/                  # Next.js App Router — thin routes only
  api/               # 40+ REST endpoints
  page.tsx           # Main dashboard
components/           # React UI components (dashboard, tickets, scheduler, backup)
  ui/               # shadcn/ui component library
lib/
  env.ts            # Zod-validated env vars — ALWAYS import from here
  logger.ts         # Structured logger — never use console.log
  trpc/routers/     # 9 tRPC router definitions
  services/         # Utility services (db, Jira, Slack, backups)
server/
  services/         # Business logic (14+ services: jira, slack, AI, handover)
  repository/       # Data access layer (7 files)
hooks/               # Custom React hooks
enums/ interfaces/ schemas/  # Shared TypeScript types and Zod schemas
prisma/
  schema.prisma     # Models: TicketData, AppSetting, ScheduledComment, Backup, Feedback
middleware.ts        # IP whitelist, session cookie auth, security headers
LazyhandBar/         # macOS native companion app (Swift/SwiftUI)
scripts/             # CLI tools and macOS build scripts
```

### Key API Endpoints
- `GET /api/tickets` — fetch Jira tickets
- `POST /api/save` — persist ticket state
- `POST /api/handover-send` — send Slack handover
- `POST /api/handover-reply` — reply to Slack thread
- `POST /api/ticket-comments` — post Jira comment
- `POST /api/ticket-transitions` — transition Jira ticket
- `POST /api/ai-autofill` — AI field completion
- `POST /api/webhook-jira` — Jira webhook receiver
- `GET /api/health` — health check (add `?deep=true` for full check)
- `GET /api/scheduler-state` — cron scheduler status

### Security (middleware.ts)
- IP whitelist with CIDR support; session cookies as fallback (7-day expiry)
- Public paths (no auth): `/api/health`, `/api/cron`, `/api/slack/commands`, `/api/webhook-jira`
- Localhost always bypassed in dev

### Environment Variables
Copy `.env.example` and fill in:
- `DATABASE_URL` — PostgreSQL connection
- `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_PROJECT_KEY`
- `SLACK_BOT_TOKEN`, `SLACK_USER_TOKEN`, `SLACK_CHANNEL_ID`
- `OPENAI_API_KEY` or `GROQ_API_KEY` (optional, for AI features)
- `CRON_SECRET` — protects `/api/cron`
- `ALLOWED_IPS` — comma-separated IPs/CIDRs for whitelist

---

## Structural Navigation (Token-Efficient)

Before reading source files, check these codemaps:

| Map | Location | Use it to find |
|-----|----------|----------------|
| Services | `docs/CODEMAPS/services.md` | Service class names, method signatures |
| API Routes | `docs/CODEMAPS/api-routes.md` | Endpoint paths, request/response shapes |
| Components | `docs/CODEMAPS/components.md` | Component hierarchy, props, hooks used |

**Cross-session memory:** The codebase is indexed in claude-mem (368 files, 1718 symbols). Use `smart_search` for symbol lookup without reading source files.

**Update rule:** When adding or modifying a service, route, or component — update the relevant codemap in the same commit. Use `/feature <name>` to scaffold new features (includes codemap update steps).

---

## Code Standards (Enforced)

### File Size Limits

| Type | Max Lines |
|------|-----------|
| API Routes | 80 |
| Services | 250 |
| Components | 200 |
| Hooks | 100 |
| Utilities | 150 |

Functions: max **30 lines**, max **4 parameters**, max **3 nesting levels**. A PostToolUse hook warns automatically when limits are exceeded after Write/Edit.

### Structure Rules
- **API routes** delegate to `server/services/` — no business logic in route files
- **Components** own no data fetching — use hooks or tRPC queries
- **`lib/env.ts`** is the single source of truth for env vars — never read `process.env` directly
- **`lib/logger.ts`** for all logging — `const logger = createLogger('ModuleName')`
- Use `apiSuccess`, `badRequest`, `handleApiError` from `@/lib/api` in API routes

### Patterns
- tRPC for internal type-safe API calls; REST for external webhooks and Jira/Slack callbacks
- Zod schemas live in `/schemas` (shared) or colocated `schema.ts` beside the route
- Feature state in Zustand stores; server state via React Query / tRPC

### Naming
- Files: `feature-name.service.ts`, `use-feature-name.ts`, `feature-name.tsx`
- Booleans: `is/has/should` prefix
- Constants: `SCREAMING_SNAKE_CASE`

### Import Order
1. React / Next.js
2. External packages
3. Internal absolute (`@/`)
4. Relative (`./`)
