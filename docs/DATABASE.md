# Database Documentation

This document describes the database schema and data models used in the Jira Slack Integration application.

## Database Provider

- **Database**: PostgreSQL
- **ORM**: Prisma
- **Schema Location**: `prisma/schema.prisma`
- **Generated Client**: `lib/generated/prisma`

## Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐
│   TicketData    │     │   AppSetting    │
├─────────────────┤     ├─────────────────┤
│ ticket_key (PK) │     │ key (PK)        │
│ status          │     │ value           │
│ action          │     │ updated_at      │
│ updated_at      │     └─────────────────┘
└─────────────────┘

┌─────────────────────┐     ┌─────────────────┐
│  ScheduledComment   │     │     Backup      │
├─────────────────────┤     ├─────────────────┤
│ id (PK)             │     │ id (PK)         │
│ comment_type        │     │ backup_type     │
│ ticket_key          │     │ ticket_data     │ (JSON)
│ comment_text        │     │ app_settings    │ (JSON)
│ cron_schedule       │     │ scheduled_      │
│ enabled             │     │   comments      │ (JSON)
│ created_at          │     │ created_at      │
│ updated_at          │     │ description     │
│ last_posted_at      │     └─────────────────┘
└─────────────────────┘

┌─────────────────┐
│    Feedback     │
├─────────────────┤
│ id (PK)         │
│ type            │
│ title           │
│ description     │
│ created_at      │
│ status          │
└─────────────────┘
```

## Models

### TicketData

Stores user-defined status and action data for Jira tickets.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `ticket_key` | VARCHAR(50) | PRIMARY KEY | Jira ticket key (e.g., "PROJ-123") |
| `status` | VARCHAR(100) | DEFAULT '--' | Current status description |
| `action` | VARCHAR(100) | DEFAULT '--' | Required action |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

**Usage**: This table is the core data store for ticket handover information.

### AppSetting

Key-value store for application settings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `key` | VARCHAR(100) | PRIMARY KEY | Setting identifier |
| `value` | TEXT | NOT NULL | Setting value (JSON or plain text) |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

**Common Settings**:
- `theme` - UI theme preference
- `memberMentions` - Slack member mention configuration
- `triggerTimes` - Scheduled trigger times
- `customChannel` - Custom Slack channel ID

### ScheduledComment

Defines automated comments to post to Jira or Slack on a schedule.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-increment ID |
| `comment_type` | VARCHAR(20) | DEFAULT 'jira' | Type: 'jira' or 'slack' |
| `ticket_key` | VARCHAR(50) | NULLABLE | Target Jira ticket (optional) |
| `comment_text` | TEXT | NOT NULL | Comment content |
| `cron_schedule` | VARCHAR(100) | NOT NULL | Cron expression |
| `enabled` | BOOLEAN | DEFAULT true | Active status |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |
| `last_posted_at` | TIMESTAMPTZ | NULLABLE | Last execution time |

**Cron Format**: Standard 5-field cron (`minute hour day month weekday`)

### Backup

Stores point-in-time snapshots of all application data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-increment ID |
| `backup_type` | VARCHAR(50) | DEFAULT 'auto' | Type: 'auto' or 'manual' |
| `ticket_data` | JSONB | NULLABLE | Snapshot of ticket_data |
| `app_settings` | JSONB | NULLABLE | Snapshot of app_settings |
| `scheduled_comments` | JSONB | NULLABLE | Snapshot of scheduled_comments |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Backup timestamp |
| `description` | TEXT | NULLABLE | User-provided description |

**Backup Strategy**:
- Auto backups are created before significant operations
- Manual backups can be triggered by users
- Restoration replaces all current data with backup snapshot

### Feedback

User-submitted feedback and bug reports.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-increment ID |
| `type` | VARCHAR(50) | NOT NULL | Type: 'bug', 'feature', 'suggestion', 'feedback' |
| `title` | TEXT | NOT NULL | Brief title |
| `description` | TEXT | NOT NULL | Detailed description |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Submission timestamp |
| `status` | VARCHAR(50) | DEFAULT 'new' | Status: 'new', 'reviewed', 'resolved', 'dismissed' |

## Indexes

Prisma automatically creates indexes for primary keys. Additional indexes can be added in `schema.prisma` if needed.

## Migrations

### Running Migrations

```bash
# Generate migration after schema changes
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Migration History

Migrations are stored in `prisma/migrations/` directory.

## Data Access Patterns

### Repository Pattern

All database operations go through repository classes:

```typescript
// Example: TicketRepository
class TicketRepository {
  async findAll(): Promise<TicketRow[]>
  async findByKey(key: string): Promise<TicketRow | null>
  async upsert(key: string, data: TicketUpsertData): Promise<TicketRow>
  async upsertMany(data: Record<string, TicketData>): Promise<void>
  async delete(key: string): Promise<boolean>
}
```

### Service Layer

Services provide business logic on top of repositories:

```typescript
// Example: TicketService
class TicketService {
  async saveTicketData(data: TicketDataMap): Promise<void>
  async loadTicketData(): Promise<TicketDataMap>
  async getTicketData(key: string): Promise<TicketData | null>
  async deleteTicketData(key: string): Promise<boolean>
}
```

## Connection Configuration

Database connection is configured via environment variable:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

### Connection Pooling

For serverless environments, use connection pooling:

```env
DATABASE_URL="postgresql://user:password@pool.host:5432/database?pgbouncer=true"
```

## Backup & Recovery

### Manual Backup via API

```bash
curl -X POST http://localhost:3000/api/backup \
  -H "Content-Type: application/json" \
  -d '{"backup_type": "manual", "description": "Pre-deployment backup"}'
```

### Restore via API

```bash
curl -X POST http://localhost:3000/api/backup/restore \
  -H "Content-Type: application/json" \
  -d '{"backupId": 1}'
```

### Database-Level Backup

For full database backup, use PostgreSQL tools:

```bash
pg_dump -h host -U user -d database > backup.sql
```

## Performance Considerations

1. **TicketData**: Primary access pattern is by `ticket_key` (PK lookup - O(1))
2. **AppSetting**: Primary access pattern is by `key` (PK lookup - O(1))
3. **ScheduledComment**: Consider index on `enabled` + `cron_schedule` for scheduler queries
4. **Backup**: Data stored as JSONB allows flexible querying if needed
5. **Feedback**: Consider index on `status` for filtered views
