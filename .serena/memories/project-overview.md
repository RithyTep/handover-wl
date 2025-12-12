# Jira-Slack-Integration Project Overview

## Quick Summary
A Next.js 16 full-stack application for managing Jira ticket handovers with Slack integration. Built with TypeScript, Prisma ORM, PostgreSQL, and follows 12-factor app methodology.

## Tech Stack
- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL via Prisma 6.19.0
- **API**: tRPC 11.7.2 (type-safe RPC)
- **State**: Zustand + TanStack Query
- **UI**: shadcn/ui + Radix UI + Tailwind CSS
- **AI**: OpenAI + Groq integration
- **Scheduling**: node-cron

## Core Features
1. **Ticket Management**: Track Jira tickets with status/action fields
2. **Slack Integration**: Post handover messages, thread replies
3. **AI Autofill**: AI-powered ticket description suggestions
4. **Scheduled Comments**: Cron-based auto-posting to Jira/Slack
5. **Backup/Restore**: Automatic and manual data backups
6. **Theme System**: 7 visual themes (default, christmas, pixel, lunar, coding, clash, angkor_pixel)

## Architecture Pattern
```
Client (React) → tRPC/API Routes → Services → Repositories → Prisma → PostgreSQL
                                      ↓
                              External APIs (Jira, Slack, AI)
```

## Key Directories
| Directory | Purpose |
|-----------|---------|
| `/app/` | Next.js App Router (pages + 27 API routes) |
| `/server/repository/` | Data access layer (8 repositories) |
| `/server/services/` | Business logic layer (6 services) |
| `/server/trpc/` | tRPC router configuration |
| `/lib/services/` | Integration services (jira.ts, slack.ts, database.ts) |
| `/lib/types/` | Zod schemas + TypeScript types |
| `/lib/config/` | Static configuration constants |
| `/lib/theme/` | Theme configurations |
| `/lib/env.ts` | Environment validation with Zod |
| `/components/` | React components + shadcn/ui |
| `/hooks/` | React custom hooks |
| `/enums/` | TypeScript enums |
| `/interfaces/` | Request/Response DTOs |
| `/schemas/` | Zod validation schemas |

## Database Entities (Prisma)
1. `TicketData` - Jira ticket state tracking
2. `AppSetting` - Key-value configuration store
3. `ScheduledComment` - Cron-scheduled comments
4. `Backup` - Auto/manual backup snapshots
5. `Feedback` - User feedback collection

## External Integrations
- **Jira API**: `/lib/services/jira.ts` - fetchTickets, postComment, fetchTicketComments
- **Slack API**: `/lib/services/slack.ts` - postMessage, postThreadReply, getHistory
- **AI Providers**: Groq (default) or OpenAI for autofill suggestions

## Security
- Challenge-based validation for mutations (`/lib/security/`)
- Proof-of-Work for bot protection
- tRPC middleware for protected procedures

## Environment Variables (via /lib/env.ts)
- DATABASE_URL, DATABASE_PUBLIC_URL
- JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN
- SLACK_BOT_TOKEN, SLACK_USER_TOKEN, SLACK_WEBHOOK_URL, SLACK_CHANNEL_ID
- GROQ_API_KEY, OPENAI_API_KEY
- APP_URL, PORT, SCHEDULE_ENABLED, LOG_LEVEL, NODE_ENV
