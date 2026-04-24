# Service Layer Codemap

> Compact structural map. Read this instead of source files. Update when adding/modifying services.
> Last updated: 2026-04-09

---

## AIAutofillService
File: `server/services/ai-autofill.service.ts`
- `generateSuggestion(ticket: AIAutofillRequest["ticket"]): Promise<{ suggestion: AISuggestion; debug: { hasComments: number; hasStatusChanges: number; wordCounts: { status: number; action: number } } }>`
- `getFallbackSuggestion(): AISuggestion`

## AIPromptService (module — no class)
File: `server/services/ai-prompt.service.ts`
Exported: `TicketContext`
- `buildTicketContext(ticket: AIAutofillRequest["ticket"], history: TicketHistory | null): TicketContext`
- `buildAIPrompt(context: string): string`
- `getSystemMessage(): string`

## BackupService
File: `server/services/backup.service.ts`
- `getAll(limit?: number): Promise<Backup[]>`
- `getAllItems(limit?: number): Promise<BackupItem[]>`
- `getById(id: number): Promise<Backup | null>`
- `create(backupType: BackupType, description?: string): Promise<Backup>`
- `restore(backupId: number): Promise<boolean>`
- `cleanupOld(keepCount?: number): Promise<number>`
- `transformToItem(backup: Backup): BackupItem`

## ChallengeService (module — no class)
File: `lib/security/challenge.service.ts`
Exported types from `./types`: `ChallengeTokenPayload`, `ChallengeResponse`, `ChallengeValidationResult`
- `generateChallengeToken(fingerprint: string): Promise<ChallengeResponse>`
- `validateChallenge(headers: Headers, requestBody?: unknown): Promise<ChallengeValidationResult>`
- `createChallengeErrorResponse(error: string): { code: string; message: string; data: { reason: string; banWarning: boolean } }`
- `hasValidInternalSecret(headers: Headers): boolean`

## FeedbackService
File: `server/services/feedback.service.ts`
- `getAll(limit?: number): Promise<Feedback[]>`
- `getAllItems(limit?: number): Promise<IFeedbackItem[]>`
- `getById(id: number): Promise<Feedback | null>`
- `create(type: FeedbackType, title: string, description: string): Promise<Feedback>`
- `updateStatus(id: number, status: FeedbackStatus): Promise<Feedback | null>`
- `delete(id: number): Promise<boolean>`
- `toItem(feedback: Feedback): IFeedbackItem`

## HandoverAIService (module — no class)
File: `server/services/handover-ai.service.ts`
- `ensureHandoverTicketsFilled(tickets: Ticket[]): Promise<{ tickets: Ticket[]; filledCount: number }>`

## HandoverService
File: `server/services/handover.service.ts`
Exported: `ScanAndReplyResult`
- `scanAndReplyToHandover(options?: { allowWithoutScheduledComments?: boolean }): Promise<ScanAndReplyResult>`

## JiraHistoryService (module — no class)
File: `server/services/jira-history.service.ts`
- `extractTextFromAdf(node: AdfNode): string`
- `extractCommentText(body: AdfNode | string | undefined): string`
- `extractDescription(description: AdfNode | string | undefined): string`
- `processComments(rawComments: JiraRawComment[], limit?: number): ProcessedComment[]`
- `extractStatusChanges(changelog: ChangelogEntry[], limit?: number): StatusChange[]`
- `extractAssigneeChanges(changelog: ChangelogEntry[], limit?: number): AssigneeChange[]`
- `fetchTicketHistory(ticketKey: string): Promise<TicketHistory | null>`

## JiraService (module — no class)
File: `lib/services/jira.ts`
Exported: `TicketAttachmentInfo`
- `fetchTickets(jql?: string, maxResults?: number): Promise<JiraIssue[]>`
- `transformIssue(issue: JiraIssue, savedData?: TicketData): Ticket`
- `getTicketsWithSavedData(savedData: Record<string, TicketData>): Promise<Ticket[]>`
- `postComment(issueKey: string, comment: string): Promise<boolean>`
- `fetchIssueAttachments(issueKey: string): Promise<TicketAttachmentInfo[]>`
- `fetchAttachmentContent(attachmentId: string, type: "content" | "thumbnail"): Promise<{ data: Buffer; contentType: string } | null>`
- `fetchJiraImageByUrl(imageUrl: string): Promise<{ data: Buffer; contentType: string } | null>`
- `fetchTicketComments(issueKey: string): Promise<CommentWithImages[]>`
- `getLatestWLTCComment(comments: Array<{ author: string; text: string; created: string }>): { author: string; text: string } | null`
- `fetchTransitions(issueKey: string): Promise<Array<{ id: string; name: string; statusName: string }>>`
- `transitionIssue(issueKey: string, transitionId: string): Promise<boolean>`
- `uploadAttachment(issueKey: string, fileBuffer: Buffer, filename: string, mimeType: string): Promise<{ id: string; filename: string; mimeType: string } | null>`
- `setDueDate(issueKey: string, dueDate: string): Promise<boolean>`
- `checkHealth(): Promise<{ healthy: boolean; latency: number; error?: string }>`
- `fetchTicketPoll(): Promise<{ total: number; latestKey: string | null }>`

## ScheduledCommentService
File: `server/services/scheduled-comment.service.ts`
Exported: `CreateCommentOptions`, `UpdateCommentServiceOptions`
- `getAll(): Promise<ScheduledComment[]>`
- `getAllItems(): Promise<IScheduledCommentItem[]>`
- `getEnabled(): Promise<ScheduledComment[]>`
- `getById(id: number): Promise<ScheduledComment | null>`
- `create(options: CreateCommentOptions): Promise<ScheduledComment>`
- `update(options: UpdateCommentServiceOptions): Promise<ScheduledComment | null>`
- `delete(id: number): Promise<boolean>`
- `updateLastPosted(id: number): Promise<void>`
- `toItem(comment: ScheduledComment): IScheduledCommentItem`

## SettingsService
File: `server/services/settings.service.ts`
- `getSchedulerEnabled(): Promise<boolean>`
- `setSchedulerEnabled(enabled: boolean): Promise<void>`
- `getTriggerTimes(): Promise<{ time1: string; time2: string }>`
- `setTriggerTimes(time1: string, time2: string): Promise<void>`
- `getCustomChannelId(): Promise<string | null>`
- `setCustomChannelId(value: string): Promise<void>`
- `getMemberMentions(): Promise<string | null>`
- `setMemberMentions(value: string): Promise<void>`
- `getEveningUserToken(): Promise<string | null>`
- `setEveningUserToken(value: string): Promise<void>`
- `getNightUserToken(): Promise<string | null>`
- `setNightUserToken(value: string): Promise<void>`
- `getEveningMentions(): Promise<string | null>`
- `setEveningMentions(value: string): Promise<void>`
- `getNightMentions(): Promise<string | null>`
- `setNightMentions(value: string): Promise<void>`

## SlackCommandsService (module — no class)
File: `lib/services/slack-commands.ts`
Exported: `SlackCommandResponse`
- `handleSlashCommand(payload: SlackCommandPayload): Promise<SlackCommandResponse>`

## SlackFormatterService (module — no class)
File: `server/services/slack-formatter.service.ts`
Exported: `TicketMessageData`, `FormatOptions`
- `formatTicketMessage(tickets: TicketMessageData[], options?: FormatOptions): string`
- `buildShiftHeader(shift: "evening" | "night"): string`
- `getHandoverMarker(): string`
- `formatTicketCopyMessage(tickets: TicketMessageData[]): string`

## SlackMessagingService
File: `server/services/slack-messaging.service.ts`
Exported: `HandoverMessageResult`, `ThreadReplyResult`, `HandoverCheckResult`, `TicketMessageData`, `FormatOptions`
- `postTicketSummary(tickets: TicketMessageData[], channel?: string, token?: string): Promise<HandoverMessageResult>`
- `postShiftHandover(tickets: TicketMessageData[], shift: "evening" | "night", token: string, channel?: string, mentions?: string): Promise<HandoverMessageResult>`
- `postHandoverReply(tickets: TicketMessageData[], threadTs: string, token: string, channel?: string, mentions?: string): Promise<ThreadReplyResult>`
- `findHandoverMessage(token: string, channel?: string, limit?: number): Promise<HandoverCheckResult>`
- `convertTicketsToMessageData(tickets: Ticket[]): TicketMessageData[]`
- `formatMessage(tickets: TicketMessageData[], options?: FormatOptions): string`

## SlackService (module — no class)
File: `lib/services/slack.ts`
- `postMessage(text: string, channel?: string, blocks?: SlackBlock[], token?: string): Promise<SlackResponse>`
- `postThreadReply(text: string, threadTs: string, channel?: string, token?: string): Promise<SlackResponse>`
- `updateMessage(text: string, ts: string, channel?: string, blocks?: SlackBlock[]): Promise<SlackResponse>`
- `getHistory(channel?: string, limit?: number, token?: string): Promise<SlackResponse>`
- `getThreadReplies(threadTs: string, channel?: string, token?: string): Promise<SlackResponse>`
- `formatDate(date?: Date): string`
- `formatTime(date?: Date): string`
- `checkHealth(): Promise<{ healthy: boolean; latency: number; error?: string }>`

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
