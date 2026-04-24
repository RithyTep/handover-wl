# API Routes Codemap

> Compact structural map. Read this instead of route files. Update when adding/modifying routes.
> Last updated: 2026-04-09

---

## POST /api/ai-autofill
File: `app/api/ai-autofill/route.ts`
Auth: required
Request: `{ ticket: { key, summary, status, assignee?, created?, dueDate?, wlMainTicketType?, wlSubTicketType?, customerLevel? } }`
Response: `{ suggestion: { status: string, action: string }, debug: any }`
Notes: Rate-limited 30 req/min per IP. Uses Groq or OpenAI based on `AI_PROVIDER` env var.

---

## GET /api/backup
File: `app/api/backup/route.ts`
Auth: required
Request: none
Response: `{ backups: [{ id, backup_type, created_at, description, ticket_count, settings_count, comments_count }] }`

## POST /api/backup
File: `app/api/backup/route.ts`
Auth: required
Request: `{ type?: "manual" | "auto", description?: string }`
Response: `{ backup: { id, backup_type, created_at, description } }`

## POST /api/backup/restore
File: `app/api/backup/restore/route.ts`
Auth: required
Request: `{ backupId: number }`
Response: `{ message: string, backup: { id, backup_type, created_at, description } }`

---

## POST /api/challenge
File: `app/api/challenge/route.ts`
Auth: none (public)
Request: `{ fingerprint: string }`
Response: `{ token: string, ... }` (challenge token object from `generateChallengeToken`)
Notes: Bot-detection challenge; returns 400 if fingerprint is invalid format.

---

## GET /api/cron
File: `app/api/cron/route.ts`
Auth: none (public) — secured via `CRON_SECRET` header (`Authorization: Bearer <secret>`)
Request: `Query: ?task=shift|backup|handover`
Response: `{ success: bool, shift?, ticketsProcessed?, messageTs?, backupId?, replied?, skipped?, reason? }`
Notes: Vercel cron endpoint. `shift` checks DB-configured times against current time in configured timezone.

---

## GET /api/custom-channel
File: `app/api/custom-channel/route.ts`
Auth: required
Request: none
Response: `{ channelId: string | null }`

## POST /api/custom-channel
File: `app/api/custom-channel/route.ts`
Auth: required
Request: `{ channelId: string }` — must match `^[A-Z0-9]+$`
Response: `{ channelId: string }`

---

## GET /api/debug
File: `app/api/debug/route.ts`
Auth: required
Request: none
Response: `{ cwd, rootDirectories, pathChecks, currentStorageDir, currentStorageFile, dataPathExists, mntPathExists, envVars }`
Notes: Filesystem/environment debug info for deployment troubleshooting.

---

## GET /api/feedback
File: `app/api/feedback/route.ts`
Auth: required
Request: none
Response: `{ data: [{ id, type, title, description, created_at, status }] }`

## POST /api/feedback
File: `app/api/feedback/route.ts`
Auth: required
Request: `{ type: "bug"|"feedback"|"suggestion"|"feature", title: string (max 200), description: string (max 2000) }`
Response: `{ data: { id, message } }`

---

## GET /api/handover-copy
File: `app/api/handover-copy/route.ts`
Auth: required
Request: none
Response: `{ text: string }` — formatted copy-paste text of all handover tickets (AI-filled)

---

## POST /api/handover-reply
File: `app/api/handover-reply/route.ts`
Auth: required
Request: `{ token?: string, channelId?: string, limit?: number, mentions?: string }` — falls back to env config
Response: `{ replied: bool, ticketsProcessed?, aiFilled?, handoverMessageTs?, replyTs?, sentAt? }`

---

## POST /api/handover-send
File: `app/api/handover-send/route.ts`
Auth: required
Request: none (uses env `SLACK_BOT_TOKEN` + `SLACK_CHANNEL_ID`)
Response: `{ ticketsProcessed: number, aiFilled: number, message_ts: string, sentAt: string }`

---

## GET /api/health
File: `app/api/health/route.ts`
Auth: none (public)
Request: `Query: ?deep=true&format=simple`
Response: `{ status, db, jira, slack, env }` or plain text if `format=simple`
Notes: Returns HTTP 503 when status is not "healthy".

---

## GET /api/jira-image
File: `app/api/jira-image/route.ts`
Auth: required
Request: `Query: ?id=<attachmentId>&type=content|thumbnail` OR `?url=<jiraImageUrl>`
Response: Binary image data with appropriate `Content-Type` header

---

## POST /api/lazyhand-auth
File: `app/api/lazyhand-auth/route.ts`
Auth: none (public)
Request: `{ password: string }`
Response: `{ success: true }` + sets auth cookie `lazyhand-auth`
Notes: Sets HTTP-only cookie on success; used for Lazyhand app authentication gate.

---

## GET /api/member-mentions
File: `app/api/member-mentions/route.ts`
Auth: required
Request: none
Response: `{ mentions: string }`

## POST /api/member-mentions
File: `app/api/member-mentions/route.ts`
Auth: required
Request: `{ mentions: string }`
Response: `{ mentions: string }`

---

## POST /api/post-jira-comment
File: `app/api/post-jira-comment/route.ts`
Auth: required
Request: `{ ticket_key: string, comment_text: string, scheduled_comment_id?: number }`
Response: `{ message: string }`
Notes: Rate-limited 20 req/min per IP. Updates `last_posted` on scheduled comment if ID provided.

---

## POST /api/post-slack-thread
File: `app/api/post-slack-thread/route.ts`
Auth: required
Request: `{ comment_text: string, thread_ts?: string, scheduled_comment_id?: number }`
Response: `{ message: string, ts: string }`
Notes: Posts to `SLACK_CHANNEL` using `SLACK_USER_TOKEN`.

---

## GET /api/revalidate
File: `app/api/revalidate/route.ts`
Auth: required
Request: `Query: ?tag=<cacheTag>&path=<path>` — omit both to revalidate all tags
Response: `{ revalidated: string[], timestamp: string }`

## POST /api/revalidate
File: `app/api/revalidate/route.ts`
Auth: required — optionally validated via `secret` field vs `REVALIDATE_SECRET` env
Request: `{ tag?: string | string[], path?: string | string[], secret?: string }`
Response: `{ revalidated: string[], timestamp: string }`

---

## POST /api/save
File: `app/api/save/route.ts`
Auth: required
Request: `{ "status-<ticketKey>": string, "action-<ticketKey>": string, ... }` — form-style flat object
Response: `{ ticketCount: number, storage: "postgresql", cacheRevalidated: true }`

---

## POST /api/scan-and-reply-handover
File: `app/api/scan-and-reply-handover/route.ts`
Auth: required
Request: none body; `Query: ?manual=1` to allow run without scheduled comments
Response: `{ message, replied, handoverMessageTs?, replyTs?, ticketsCount? }`

---

## GET /api/scheduled-comments
File: `app/api/scheduled-comments/route.ts`
Auth: required
Request: none
Response: `{ comments: ScheduledComment[] }`

## POST /api/scheduled-comments
File: `app/api/scheduled-comments/route.ts`
Auth: required
Request: `{ comment_type?: "jira"|"slack", ticket_key?: string, comment_text: string, cron_schedule: string, enabled?: bool }`
Response: `{ comment: ScheduledComment }`

## PUT /api/scheduled-comments
File: `app/api/scheduled-comments/route.ts`
Auth: required
Request: `{ id: number, comment_type?: "jira"|"slack", ticket_key?: string, comment_text: string, cron_schedule: string, enabled: bool }`
Response: `{ comment: ScheduledComment }`

## DELETE /api/scheduled-comments
File: `app/api/scheduled-comments/route.ts`
Auth: required
Request: `Query: ?id=<commentId>`
Response: `{ success: true }`

---

## POST /api/scheduled-slack
File: `app/api/scheduled-slack/route.ts`
Auth: required
Request: `{ shift: "evening" | "night" }`
Response: `{ shift, ticketsProcessed, message_ts, sentAt }`
Notes: Posts shift handover message to Slack using the configured shift user token.

---

## GET /api/scheduler-state
File: `app/api/scheduler-state/route.ts`
Auth: required
Request: none
Response: `{ enabled: boolean }`

## POST /api/scheduler-state
File: `app/api/scheduler-state/route.ts`
Auth: required
Request: `{ enabled: boolean }`
Response: `{ enabled: boolean, message: string }`

---

## POST /api/send-slack
File: `app/api/send-slack/route.ts`
Auth: required
Request: `{ ticketData: Record<"status-<key>"|"action-<key>", string>, ticketDetails: Record<ticketKey, { summary, wlMainTicketType, wlSubTicketType }> }`
Response: `{ message_ts: string }`
Notes: Rate-limited 10 req/min per IP. Saves ticket data to DB and posts formatted message to Slack.

---

## POST /api/set-duedate
File: `app/api/set-duedate/route.ts`
Auth: required
Request: `{ ticket_key: string, due_date: string }`
Response: `{ success: bool, message: string }`

---

## GET /api/shift-tokens
File: `app/api/shift-tokens/route.ts`
Auth: required
Request: none
Response: `{ data: { eveningToken, nightToken, eveningMentions, nightMentions } }`

## POST /api/shift-tokens
File: `app/api/shift-tokens/route.ts`
Auth: required
Request: `{ eveningToken?, nightToken?, eveningMentions?, nightMentions? }` — all fields optional, set only provided
Response: `{ message: "Shift settings updated successfully" }`

---

## POST /api/slack/commands
File: `app/api/slack/commands/route.ts`
Auth: none (public) — verified via Slack request signature (`verifySlackRequest`)
Request: Slack slash command form body (URL-encoded)
Response: Slack response payload `{ response_type, text, ... }`
Notes: Handles all `/slash` commands from Slack workspace.

---

## GET /api/slack-thread
File: `app/api/slack-thread/route.ts`
Auth: required
Request: none
Response: `{ messages: [{ ts, text, user }] }` — last 10 messages from configured channel

## POST /api/slack-thread
File: `app/api/slack-thread/route.ts`
Auth: required
Request: `{ message: string, thread_ts?: string }`
Response: `{ ts: string, channel: string, message: string }`

---

## GET /api/test-storage
File: `app/api/test-storage/route.ts`
Auth: required
Request: none
Response: `{ storageDir, testFile, previousContent, newTimestamp, verifiedContent, fileExistedBefore, allFilesInStorage }`
Notes: Dev/debug — writes a timestamp to a test file and reads it back to verify persistence.

---

## GET /api/theme
File: `app/api/theme/route.ts`
Auth: required
Request: none
Response: `{ theme: "default" | "christmas" }`

## POST /api/theme
File: `app/api/theme/route.ts`
Auth: required
Request: `{ theme: "default" | "christmas" }`
Response: `{ theme: "default" | "christmas" }`

---

## GET /api/ticket-attachments
File: `app/api/ticket-attachments/route.ts`
Auth: required
Request: `Query: ?key=<jiraTicketKey>`
Response: `{ attachments: Attachment[] }`

---

## GET /api/ticket-comments
File: `app/api/ticket-comments/route.ts`
Auth: required
Request: `Query: ?key=<jiraTicketKey>`
Response: `{ comments: Comment[] }`

---

## GET /api/ticket-transitions
File: `app/api/ticket-transitions/route.ts`
Auth: required
Request: `Query: ?key=<jiraTicketKey>`
Response: `{ transitions: Transition[] }`

---

## GET /api/ticket_data.json
File: `app/api/ticket_data.json/route.ts`
Auth: required
Request: none
Response: Flat JSON `{ "status-<key>": string, "action-<key>": string, ... }` — raw saved ticket data

---

## GET /api/tickets
File: `app/api/tickets/route.ts`
Auth: required
Request: none
Response: `{ tickets: Ticket[], total: number, storage: "postgresql" }`

---

## GET /api/tickets-poll
File: `app/api/tickets-poll/route.ts`
Auth: required
Request: none
Response: `{ total: number, latestKey: string, ts: number }`
Notes: Lightweight poll endpoint (~200ms). Use instead of `/api/tickets` for change detection.

---

## POST /api/transition-ticket
File: `app/api/transition-ticket/route.ts`
Auth: required
Request: `{ ticket_key: string, transition_id: string }`
Response: `{ message: string }`

---

## POST /api/trigger-schedule
File: `app/api/trigger-schedule/route.ts`
Auth: required
Request: none
Response: `{ message: "Scheduled task triggered manually", triggeredAt: string }`
Notes: Rate-limited 5 req/min per IP.

---

## GET /api/trigger-times
File: `app/api/trigger-times/route.ts`
Auth: required
Request: none
Response: `{ times: { time1: string, time2: string } }` — HH:mm format

## POST /api/trigger-times
File: `app/api/trigger-times/route.ts`
Auth: required
Request: `{ time1: string, time2: string }` — HH:mm format (e.g., "17:10")
Response: `{ times: { time1, time2 } }`

---

## GET|POST /api/trpc/[procedure]
File: `app/api/trpc/[trpc]/route.ts`
Auth: `publicProcedure` = none; `protectedMutation` = required (lazyhand-auth cookie)
Note: tRPC endpoint — see `lib/trpc/routers/` and `server/trpc/routers/` for procedure definitions.

### tRPC Routers & Procedures

| Router | Procedure | Type | Auth |
|--------|-----------|------|------|
| `ai` | `autofill` | mutation | public |
| `backup` | `getAll` | query | public |
| `backup` | `create` | mutation | protected |
| `backup` | `restore` | mutation | protected |
| `feedback` | `getAll` | query | public |
| `feedback` | `create` | mutation | protected |
| `scheduledComments` | `getAll` | query | public |
| `scheduledComments` | `create` | mutation | protected |
| `scheduledComments` | `update` | mutation | protected |
| `scheduledComments` | `delete` | mutation | protected |
| `scheduler` | `getState` | query | public |
| `scheduler` | `setState` | mutation | protected |
| `scheduler` | `getTriggerTimes` | query | public |
| `scheduler` | `setTriggerTimes` | mutation | protected |
| `scheduler` | `triggerSchedule` | mutation | protected |
| `settings` | `getCustomChannel` | query | public |
| `settings` | `setCustomChannel` | mutation | protected |
| `settings` | `getShiftTokens` | query | public |
| `settings` | `setShiftTokens` | mutation | protected |
| `settings` | `getMemberMentions` | query | public |
| `settings` | `setMemberMentions` | mutation | protected |
| `slack` | `send` | mutation | protected |
| `slack` | `postThread` | mutation | protected |
| `theme` | `getAll` | query | public |
| `theme` | `getSelected` | query | public |
| `theme` | `setSelected` | mutation | protected |
| `ticketData` | `save` | mutation | protected |
| `tickets` | `getAll` | query | public |
| `tickets` | `getReleaseDateTickets` | query | public |

---

## POST /api/upload-attachment
File: `app/api/upload-attachment/route.ts`
Auth: required
Request: `multipart/form-data: { ticket_key: string, file: File }`
Response: `{ filename: string, mimeType: string }`

---

## POST /api/webhook-jira
File: `app/api/webhook-jira/route.ts`
Auth: none (public)
Request: Jira webhook payload `{ webhookEvent: string, issue?: { key: string }, ... }`
Response: `{ event, issueKey, received: timestamp }`
Notes: Stores `webhook_last_event` + `webhook_last_issue` in DB settings. Configure in Jira Admin → Webhooks.
