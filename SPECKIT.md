# Project Specification Kit

Technical specification and architecture documentation for AI assistants.

## Project Overview

**Name**: Jira Handover Dashboard
**Stack**: Next.js 16, React 19, TypeScript, Prisma, tRPC
**Purpose**: Daily ticket handover management with Jira/Slack integration

## Tech Stack Details

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router) | 16.x |
| UI | React | 19.x |
| Language | TypeScript | 5.x |
| ORM | Prisma | Latest |
| API | tRPC | 11.x |
| Validation | Zod | Latest |
| State | Zustand | Latest |
| Styling | Tailwind CSS | 4.x |

## Directory Structure

```
jira-slack-integration/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (thin controllers)
│   │   ├── ai-autofill/   # AI suggestion endpoint
│   │   ├── health/        # Health check
│   │   ├── tickets/       # Ticket CRUD
│   │   └── ...
│   ├── globals.css        # Global styles + theme CSS
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard
│
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard-*.tsx   # Dashboard feature components
│   └── tickets-*.tsx     # Ticket-related components
│
├── server/               # Server-side code
│   ├── services/         # Business logic services
│   │   ├── index.ts      # Service exports
│   │   ├── ai-autofill.service.ts
│   │   ├── slack-messaging.service.ts
│   │   ├── handover.service.ts
│   │   └── ...
│   └── repositories/     # Data access layer
│
├── lib/                  # Shared utilities
│   ├── api/             # API response utilities
│   │   ├── index.ts
│   │   └── response.ts
│   ├── services/        # External API clients
│   │   ├── slack.ts     # Slack API
│   │   ├── jira.ts      # Jira API
│   │   └── database.ts  # DB operations
│   ├── stores/          # Zustand stores
│   ├── theme/           # Theme system
│   │   ├── types.ts
│   │   ├── theme-config.ts
│   │   └── themes/      # Individual theme configs
│   ├── types/           # Shared type definitions
│   ├── env.ts           # Environment config
│   ├── logger.ts        # Logging utility
│   └── constants.ts     # App constants
│
├── enums/               # TypeScript enums
├── hooks/               # React hooks
├── interfaces/          # Legacy interfaces (migrate to lib/types)
├── prisma/              # Database schema
│
├── .serena/             # Serena AI config
│   └── memories/        # AI context documents
│
├── CLAUDE.md            # Claude Code rules
└── SPECKIT.md           # This file
```

## Key Patterns

### 1. API Route Pattern
Location: `app/api/*/route.ts`
```typescript
// Thin controller - delegates to service
import { Service } from "@/server/services"
import { apiSuccess, handleApiError } from "@/lib/api"

export async function POST(request: Request) {
  try {
    const result = await service.method()
    return apiSuccess({ result })
  } catch (error) {
    return handleApiError(error, "POST /api/endpoint")
  }
}
```

### 2. Service Pattern
Location: `server/services/*.service.ts`
```typescript
// Business logic encapsulation
export class FeatureService {
  async doSomething(input: Input): Promise<Output> {
    // Orchestrate business logic
    // Call repositories for data
    // Call lib services for external APIs
  }
}
```

### 3. Theme System
Location: `lib/theme/`
```typescript
// Modular theme configuration
// types.ts - Type definitions
// themes/*.ts - Individual theme configs
// theme-config.ts - Accessor functions
```

## External Integrations

### Jira API
- **Client**: `lib/services/jira.ts`
- **Auth**: Basic auth via `JIRA_*` env vars
- **Used for**: Fetching tickets, comments, history

### Slack API
- **Low-level**: `lib/services/slack.ts`
- **High-level**: `server/services/slack-messaging.service.ts`
- **Auth**: Bot token + User token
- **Used for**: Posting handover messages, thread replies

### AI (OpenAI/Groq)
- **Service**: `server/services/ai-autofill.service.ts`
- **Config**: `lib/env.ts` → `getAIConfig()`
- **Used for**: Generating ticket status suggestions

## Environment Variables

```bash
# Database
DATABASE_URL=

# Jira
JIRA_BASE_URL=
JIRA_EMAIL=
JIRA_API_TOKEN=
JIRA_PROJECT_KEY=

# Slack
SLACK_BOT_TOKEN=
SLACK_USER_TOKEN=
SLACK_CHANNEL_ID=

# AI
AI_PROVIDER=groq|openai
GROQ_API_KEY=
OPENAI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

## Database Schema

Location: `prisma/schema.prisma`
- Tickets data cached locally
- Settings and preferences
- Scheduled comments configuration
- Backup data

## Theme System

7 themes available:
- `default` - Dark slate theme
- `pixel` - Retro pixel art
- `lunar` - Chinese New Year
- `christmas` - Holiday theme
- `coding` - Developer/terminal style
- `clash` - Clash of Clans style
- `angkor_pixel` - Cambodian pixel art

Adding new themes: See `.serena/memories/theme-integration-checklist.md`

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/tickets` | GET | Fetch all tickets |
| `/api/ai-autofill` | POST | Get AI suggestion |
| `/api/send-slack` | POST | Send to Slack |
| `/api/save` | POST | Save ticket data |
| `/api/health` | GET | Health check |
| `/api/backup` | GET/POST | Backup operations |
| `/api/theme` | GET/POST | Theme settings |

## Performance Considerations

- Server Components for static content
- Client Components only for interactivity
- Incremental Static Regeneration where applicable
- API routes are edge-compatible

## Testing

```bash
npm run build    # Type checking + build
npm run dev      # Development server
```

## Common Tasks

### Add New API Endpoint
1. Create `app/api/new-endpoint/route.ts`
2. Create `server/services/new-feature.service.ts`
3. Export from `server/services/index.ts`
4. Keep route < 100 lines

### Add New Theme
See `.serena/memories/theme-integration-checklist.md`

### Add New Service
1. Create `server/services/feature.service.ts`
2. Export from `server/services/index.ts`
3. Use in API routes via import
