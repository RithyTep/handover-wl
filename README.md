# Jira Handover Dashboard

A Next.js 16 application for managing Jira ticket handovers with Slack integration. Built following the **Twelve-Factor App** methodology for cloud-native deployments.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Twelve-Factor App Compliance](#twelve-factor-app-compliance)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

## Features

- **Jira Integration**: Fetch and display tickets from Jira with custom fields
- **Slack Integration**: Post handover messages and thread replies
- **Scheduled Tasks**: Automated handover notifications at configurable times
- **Backup System**: Automatic and manual backup/restore functionality
- **Theme Support**: Multiple UI themes including dark mode
- **AI-Powered**: Optional AI autofill for ticket actions

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   App UI    │  │  API Routes │  │    tRPC Routers    │  │
│  │  (React)    │  │             │  │                     │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│         └────────────────┼─────────────────────┘             │
│                          │                                   │
│  ┌───────────────────────▼───────────────────────────────┐  │
│  │                   Service Layer                        │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │  │
│  │  │ Database │  │   Jira   │  │  Slack   │            │  │
│  │  │ Service  │  │ Service  │  │ Service  │            │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘            │  │
│  └───────┼─────────────┼─────────────┼──────────────────┘  │
└──────────┼─────────────┼─────────────┼──────────────────────┘
           │             │             │
           ▼             ▼             ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │PostgreSQL│   │Jira API  │   │Slack API │
    │          │   │          │   │          │
    └──────────┘   └──────────┘   └──────────┘
     (Factor IV)    (Factor IV)   (Factor IV)
```

## Twelve-Factor App Compliance

This application follows the [Twelve-Factor App](https://12factor.net/) methodology:

| Factor | Implementation |
|--------|---------------|
| **I. Codebase** | Single Git repository, multiple deploys |
| **II. Dependencies** | Explicitly declared in `package.json`, isolated via `node_modules` |
| **III. Config** | Environment variables via `lib/env.ts` with Zod validation |
| **IV. Backing Services** | PostgreSQL, Jira API, Slack API as attached resources |
| **V. Build, Release, Run** | Separate build (`npm run build`) and run (`npm start`) stages |
| **VI. Processes** | Stateless processes, state stored in PostgreSQL |
| **VII. Port Binding** | Self-contained HTTP server via Next.js |
| **VIII. Concurrency** | Horizontal scaling via process model |
| **IX. Disposability** | Fast startup, graceful shutdown, health checks at `/api/health` |
| **X. Dev/Prod Parity** | Same stack across environments |
| **XI. Logs** | Structured logging via `lib/logger.ts`, output to stdout |
| **XII. Admin Processes** | Database migrations, backup/restore via API |

## Getting Started

### Prerequisites

- Node.js 20.9.0 or higher
- PostgreSQL database
- Jira Cloud account with API token
- Slack workspace (optional)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jira-slack-integration
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## Configuration

### Environment Variables

All configuration is managed through environment variables following Factor III.

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JIRA_URL` | Yes | Jira instance URL |
| `JIRA_EMAIL` | Yes | Jira account email |
| `JIRA_API_TOKEN` | Yes | Jira API token |
| `SLACK_BOT_TOKEN` | No | Slack bot OAuth token |
| `SLACK_CHANNEL` | No | Default Slack channel ID |
| `SCHEDULE_ENABLED` | No | Enable scheduled tasks (default: false) |
| `LOG_LEVEL` | No | Logging level: debug, info, warn, error |

See `.env.example` for complete configuration template.

### Type-Safe Configuration

Environment variables are validated at startup using Zod schemas in `lib/env.ts`:

```typescript
import { env, getJiraConfig, getSlackConfig, getDatabaseConfig } from '@/lib/env';

// Access validated environment
const appUrl = env.APP_URL;

// Get service-specific configs
const jiraConfig = getJiraConfig();
const slackConfig = getSlackConfig();
const dbConfig = getDatabaseConfig();
```

## Development

### Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API route handlers
│   │   ├── health/        # Health check endpoint
│   │   ├── tickets/       # Ticket CRUD operations
│   │   └── trpc/          # tRPC handler
│   └── page.tsx           # Main dashboard
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── config/           # Static configuration constants
│   ├── services/         # Service layer (database, jira, slack)
│   ├── trpc/             # tRPC router definitions
│   ├── env.ts            # Type-safe environment config
│   ├── logger.ts         # Structured logging utility
│   └── utils.ts          # Utility functions
├── server/               # Server-side code
│   ├── repository/       # Data access layer
│   └── services/         # Business logic
└── hooks/                # React hooks
```

### Available Scripts

```bash
# Development
npm run dev              # Start dev server on port 3000

# Build & Production
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
```

### CLI (Local Install)

After cloning and installing dependencies, you can enable a global `handover` command:

```bash
npm run setup:cli
```

### CLI (One-Line Install)

From the repo root:
```bash
curl -fsSL https://raw.githubusercontent.com/RithyTep/handover-wl/main/scripts/install-cli.sh | bash
```

### Full UI (Browser)

Launch the local scheduler dashboard:
```bash
node scripts/lazyhand-ui.mjs
```

Or double-click:
```bash
./scripts/lazyhand-ui.command
```

The UI stores your settings in `~/.lazyhand/config.json` and applies the
schedule using `scripts/setup-lazyhand-macos.sh`.

Use "Sync LaunchAgent" to pull the active schedule from
`~/Library/LaunchAgents/com.handover.lazyhand.plist`.

Preset times:
```bash
# Day preset: 17:16
SCHEDULE_PRESET=day ./scripts/setup-lazyhand-macos.sh

# Night preset: 23:46
SCHEDULE_PRESET=night ./scripts/setup-lazyhand-macos.sh
```

### Auto-Start UI on macOS

Install a background LaunchAgent so the UI server runs even after closing the app:
```bash
./scripts/setup-lazyhand-ui-macos.sh
```

Open it later at `http://127.0.0.1:3199` (or set `LAZYHAND_UI_PORT` before install).

### GUI CLI (Installable)

After running `npm run setup:cli`, you can launch the UI with:
```bash
handover-gui
```

### Native macOS App (No Xcode)

Build a native `.app` wrapper that launches the local UI:
```bash
./scripts/build-lazyhand-app.sh
```

Then open:
`dist/Lazyhand.app`

On first run, the app asks for your repo path and saves it to `~/.lazyhand/app_path`.

### DMG Package (macOS)

Build a DMG you can share:
```bash
./scripts/build-lazyhand-dmg.sh
```

Output: `dist/Lazyhand.dmg`

Usage:
```bash
handover copy    # Copy handover text to clipboard
handover send    # Send handover to Slack
handover print   # Print handover text to stdout
handover reply   # Reply to latest handover message in Slack
lazyhand         # AI fill missing fields and reply to latest handover
```

Set `HANDOVER_APP_URL` (or `APP_URL`) to point at your running app, e.g.
`HANDOVER_APP_URL=http://localhost:3000`.

For `handover reply`, set:
`HANDOVER_SLACK_USER_TOKEN` (or `SLACK_USER_TOKEN`) and
`HANDOVER_SLACK_CHANNEL_ID` (or `SLACK_CHANNEL_ID`).
Optional: `HANDOVER_SLACK_MENTIONS` (e.g. `<@U123> <@U456>`), or pass
`--mentions "<@U123> <@U456>"`.

### Logging

The application uses structured logging (Factor XI):

```typescript
import { logger, createLogger } from '@/lib/logger';

// Pre-configured loggers
logger.db.info('Database connected');
logger.jira.error('API call failed', { error: message });
logger.slack.warn('Rate limited');

// Custom logger
const log = createLogger('MyService');
log.info('Operation completed', { duration_ms: 150 });
```

**Log Levels:**
- `debug`: Detailed debugging information
- `info`: General operational information
- `warn`: Warning conditions
- `error`: Error conditions

In production, logs are output as JSON for log aggregation tools.

## Deployment

### Railway Deployment

1. **Create Railway project**
   ```bash
   railway init
   ```

2. **Add PostgreSQL**
   ```bash
   railway add postgresql
   ```

3. **Configure environment variables**
   - Set all required variables in Railway dashboard
   - Use internal `DATABASE_URL` for production

4. **Deploy**
   ```bash
   railway up
   ```

### Environment-Specific Configuration

| Environment | DATABASE_URL | LOG_LEVEL | SCHEDULE_ENABLED |
|-------------|--------------|-----------|------------------|
| Development | Public URL | debug | false |
| Staging | Public URL | info | true |
| Production | Internal URL | info | true |

### Health Checks

The `/api/health` endpoint provides comprehensive health status:

```bash
# Quick health check
curl http://localhost:3000/api/health

# Deep health check (all services)
curl http://localhost:3000/api/health?deep=true

# Simple format (for load balancers)
curl http://localhost:3000/api/health?format=simple
```

**Response Example:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "3.6.0",
  "environment": "production",
  "uptime_seconds": 3600,
  "services": {
    "database": { "status": "healthy", "latency_ms": 5 },
    "jira": { "status": "healthy", "latency_ms": 150 },
    "slack": { "status": "healthy", "latency_ms": 100 }
  },
  "config": {
    "all_required_set": true,
    "environment_vars": {
      "DATABASE_URL": true,
      "JIRA_URL": true,
      "JIRA_EMAIL": true,
      "JIRA_API_TOKEN": true,
      "SLACK_BOT_TOKEN": true,
      "SLACK_CHANNEL": true
    }
  }
}
```

## API Reference

### Tickets

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tickets` | GET | List all tickets |
| `/api/ticket-data` | GET | Get saved ticket data |
| `/api/save` | POST | Save ticket data |

### Scheduler

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/scheduler-state` | GET | Get scheduler status |
| `/api/trigger-times` | GET/POST | Get/set trigger times |
| `/api/scheduled-comments` | GET/POST | Manage scheduled comments |

### Backup

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/backup` | GET/POST | List/create backups |
| `/api/backup/restore` | POST | Restore from backup |

### Health

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/health?deep=true` | GET | Deep health check |

## Troubleshooting

### Common Issues

**Database connection failed**
```bash
# Check DATABASE_URL format
postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# For Railway, use internal URL in production
DATABASE_URL=postgresql://postgres:xxx@postgres.railway.internal:5432/railway
```

**Jira API errors**
- Verify `JIRA_API_TOKEN` is valid
- Check `JIRA_EMAIL` matches the token owner
- Ensure API access is enabled for your Atlassian account

**Slack messages not sending**
- Verify bot token has required scopes (`chat:write`, `channels:read`)
- Check channel ID format (should start with `C`)
- Ensure bot is invited to the channel

### Debug Mode

Enable debug logging:
```bash
LOG_LEVEL=debug npm run dev
```

### Health Check Debugging

```bash
# Check all services
curl http://localhost:3000/api/health?deep=true | jq

# Check specific service
# Look for service-specific errors in the response
```

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the coding standards
4. Submit a pull request

---

Built with Next.js 16, React 19, and TypeScript. Deployed on Railway.
