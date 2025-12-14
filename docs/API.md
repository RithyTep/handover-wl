# API Documentation

This document describes all API endpoints available in the Jira Slack Integration application.

## Base URL

All endpoints are relative to the application root:
- **Development**: `http://localhost:3000`
- **Production**: Your deployment URL

## Authentication

Most mutation endpoints require a PoW (Proof of Work) challenge for protection:

1. First, request a challenge from `/api/challenge`
2. Solve the challenge client-side
3. Include the solution in subsequent requests via headers:
   - `x-challenge-session`: Session ID
   - `x-challenge-solution`: Solved nonce

## Endpoints

### Health Check

#### GET `/api/health`

Check application health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```

---

### Tickets

#### GET `/api/tickets`

Fetch all Jira tickets with saved status/action data.

**Response:**
```json
{
  "success": true,
  "tickets": [
    {
      "key": "PROJ-123",
      "summary": "Ticket summary",
      "status": "In Progress",
      "action": "Review",
      "wlMainTicketType": "Bug",
      "wlSubTicketType": "Critical"
    }
  ],
  "total": 1
}
```

---

### Save Data

#### POST `/api/save`

Save ticket status and action data.

**Headers:**
- `x-challenge-session`: Session ID
- `x-challenge-solution`: Solved nonce

**Request Body:**
```json
{
  "status-PROJ-123": "In Progress",
  "action-PROJ-123": "Review code"
}
```

**Response:**
```json
{
  "success": true,
  "ticketCount": 1
}
```

---

### Slack Integration

#### POST `/api/send-slack`

Send a message to Slack channel.

**Headers:**
- `x-challenge-session`: Session ID
- `x-challenge-solution`: Solved nonce

**Request Body:**
```json
{
  "message": "Your message content",
  "channel": "C1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "ts": "1234567890.123456"
}
```

#### POST `/api/post-slack-thread`

Post a threaded reply in Slack.

**Request Body:**
```json
{
  "channel": "C1234567890",
  "thread_ts": "1234567890.123456",
  "text": "Reply message"
}
```

#### GET `/api/slack-thread`

Search for a Slack thread by marker text.

**Query Parameters:**
- `channel`: Slack channel ID
- `marker`: Text to search for

---

### Jira Integration

#### POST `/api/post-jira-comment`

Post a comment to a Jira ticket.

**Headers:**
- `x-challenge-session`: Session ID
- `x-challenge-solution`: Solved nonce

**Request Body:**
```json
{
  "ticketKey": "PROJ-123",
  "comment": "Your comment text"
}
```

---

### AI Autofill

#### POST `/api/ai-autofill`

Generate AI suggestions for ticket status and actions.

**Headers:**
- `x-challenge-session`: Session ID
- `x-challenge-solution`: Solved nonce

**Request Body:**
```json
{
  "tickets": [
    {
      "key": "PROJ-123",
      "summary": "Fix login bug",
      "description": "Users cannot login..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "suggestions": {
    "PROJ-123": {
      "status": "In Progress",
      "action": "Investigate root cause"
    }
  }
}
```

---

### Backup & Restore

#### GET `/api/backup`

List all backups.

**Response:**
```json
{
  "success": true,
  "backups": [
    {
      "id": 1,
      "backup_type": "manual",
      "description": "Daily backup",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/api/backup`

Create a new backup.

**Request Body:**
```json
{
  "backup_type": "manual",
  "description": "Before major changes"
}
```

#### POST `/api/backup/restore`

Restore from a backup.

**Request Body:**
```json
{
  "backupId": 1
}
```

---

### Scheduled Comments

#### GET `/api/scheduled-comments`

List all scheduled comments.

#### POST `/api/scheduled-comments`

Create a scheduled comment.

**Request Body:**
```json
{
  "comment_type": "slack",
  "comment_text": "Daily standup reminder",
  "cron_schedule": "0 9 * * 1-5",
  "enabled": true,
  "ticket_key": "PROJ-123"
}
```

---

### Challenge (PoW)

#### GET `/api/challenge`

Request a new PoW challenge.

**Response:**
```json
{
  "sessionId": "abc123...",
  "prefix": "0000",
  "data": "challenge-data-string",
  "difficulty": 4
}
```

---

### Settings

#### GET `/api/theme`

Get current theme settings.

#### POST `/api/theme`

Update theme settings.

**Request Body:**
```json
{
  "theme": "dark",
  "specialMode": "christmas"
}
```

---

### Member Mentions

#### GET `/api/member-mentions`

Get configured Slack member mentions for shifts.

#### POST `/api/member-mentions`

Update member mentions configuration.

---

### Trigger Times

#### GET `/api/trigger-times`

Get scheduled trigger times configuration.

#### POST `/api/trigger-times`

Update trigger times.

---

### Feedback

#### GET `/api/feedback`

List all feedback items.

#### POST `/api/feedback`

Submit new feedback.

**Request Body:**
```json
{
  "type": "bug",
  "title": "Button not working",
  "description": "The save button doesn't respond"
}
```

---

## tRPC Endpoints

The application also exposes tRPC procedures at `/api/trpc/*`:

### Tickets Router
- `tickets.getAll` - Get all tickets with cached data

### Ticket Data Router
- `ticketData.save` - Save ticket status/action data

### Scheduled Comments Router
- `scheduledComments.getAll` - List scheduled comments
- `scheduledComments.create` - Create comment
- `scheduledComments.update` - Update comment
- `scheduledComments.delete` - Delete comment

### Backup Router
- `backup.getAll` - List backups
- `backup.create` - Create backup
- `backup.restore` - Restore from backup

### Feedback Router
- `feedback.getAll` - List feedback
- `feedback.create` - Submit feedback

---

## Error Responses

All endpoints return errors in a consistent format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `VALIDATION_ERROR` - Invalid request data
- `UNAUTHORIZED` - Missing or invalid challenge
- `RATE_LIMITED` - Too many requests
- `INTERNAL_ERROR` - Server error

## Rate Limiting

- `/api/ai-autofill`: 10 requests/minute
- `/api/send-slack`: 30 requests/minute
- `/api/challenge`: 60 requests/minute
