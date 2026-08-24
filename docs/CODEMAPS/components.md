# Components Codemap

> Compact structural map. Read this instead of source files. Update when adding/modifying components.
> Last updated: 2026-04-09
> Note: `components/ui/` (shadcn/ui primitives) excluded — standard shadcn components.

---

<!-- Root-level components -->

## AngkorPixelScene
File: `components/angkor-pixel-scene.tsx`
Props: none
Uses: nothing (static animation only)

## BackupClient
File: `components/backup-client.tsx`
Props: `{ initialBackups: BackupItem[] }`
Uses: trpc.backup.getAll, trpc.backup.restore, BackupStats, BackupTable, RestoreDialog, ThemeToggle

## ClearDialog
File: `components/clear-dialog.tsx`
Props: `{ open: boolean; onOpenChange: (open: boolean) => void; onClearAll: () => void }`
Uses: nothing

## CodingFooter
File: `components/coding-footer.tsx`
Props: none
Uses: nothing (static status bar UI)

## CodingScene
File: `components/coding-scene.tsx`
Props: none
Uses: nothing (static animated background)

## CommandPalette
File: `components/command-palette.tsx`
Props: `{ onQuickFill?: () => void; onAIFillAll?: () => void; onClear?: () => void; onSave?: () => void; onSendSlack?: () => void; onCopy?: () => void; onRefresh?: () => void }`
Uses: useTheme (next-themes)

## DashboardActions
File: `components/dashboard-actions.tsx`
Props: `{ theme: Theme; onAIFillAll: () => void; onQuickFill: (status: string, action: string) => void; onClear: () => void; onRefresh: () => void; onCopy: () => void; onSave: () => void; onSendSlack: () => void }`
Uses: getActionsConfig (lib/theme)

## DashboardClient
File: `components/dashboard-client.tsx`
Props: `{ initialTickets?: Ticket[]; initialTheme?: Theme }`
Uses: useTickets, useReleaseDateTickets, useTicketActions, useThemeStore, DashboardLayout

## DashboardContent
File: `components/dashboard-content.tsx`
Props: `{ tickets: Ticket[]; ticketData: Record<string, string>; updateTicketData: (key: string, value: string) => void; renderKey: number; theme: Theme; activeTab: DashboardTab; onAIFillAll: () => void; onQuickFill: (status: string, action: string) => void; onClear: () => void; onRefresh: () => void; onCopy: () => void; onSave: () => void; onSendSlack: () => void }`
Uses: TicketsTable, DashboardActions, createColumns, createReleaseDateColumns

## DashboardHeader
File: `components/dashboard-header.tsx`
Props: `{ theme: Theme; ticketCount: number }`
Uses: ThemeSelector, getHeaderConfig, getHeaderNavItems, getKbdIcon (lib/theme)

## DashboardLayout
File: `components/dashboard-layout.tsx`
Props: `{ theme: Theme; tickets: Ticket[]; ticketData: Record<string, string>; updateTicketData: (key: string, value: string) => void; renderKey: number; activeTab: DashboardTab; onTabChange: (tab: DashboardTab) => void; pendingCount: number; releaseDateCount: number; onAIFillAll: () => void; onQuickFill: (status: string, action: string) => void; onClear: () => void; onRefresh: () => void; onCopy: () => void; onSave: () => void; onSendSlack: () => Promise<void>; quickFillOpen: boolean; onQuickFillOpenChange: (open: boolean) => void; clearOpen: boolean; onClearOpenChange: (open: boolean) => void; sendSlackOpen: boolean; onSendSlackOpenChange: (open: boolean) => void }`
Uses: DashboardHeader, DashboardContent, DashboardMobileActions, DashboardTabBar, CommandPalette, QuickFillDialog, ClearDialog, SendSlackDialog, getLayoutConfig (lib/theme); dynamically imports all theme scenes

## DashboardMobileActions
File: `components/dashboard-mobile-actions.tsx`
Props: `{ theme: Theme; onAIFillAll: () => void; onQuickFill: () => void; onClear: () => void; onSave: () => void; onSendSlack: () => void }`
Uses: getMobileActionsConfig, getLayoutConfig (lib/theme)

## DashboardTabBar
File: `components/dashboard-tab-bar.tsx`
Props: `{ activeTab: DashboardTab; onTabChange: (tab: DashboardTab) => void; pendingCount: number; releaseDateCount: number; theme: Theme }`
Uses: nothing

## FeedbackClient
File: `components/feedback-client.tsx`
Props: none
Uses: trpc.feedback.getAll, FeedbackForm, FeedbackList, FeedbackSuccess

## LunarHongbao
File: `components/lunar-hongbao.tsx`
Props: none
Uses: nothing (decorative UI only)

## LunarScene
File: `components/lunar-scene.tsx`
Props: none
Uses: LunarHongbao

## NewYearScene
File: `components/new-year-scene.tsx`
Props: none
Uses: re-exports from `components/new-year/new-year-scene.tsx`

## PchumBenScene
File: `components/pchum-ben-scene.tsx`
Props: none
Uses: nothing (static candlelight/ember animation only)

## PixelStatusBar
File: `components/pixel-status-bar.tsx`
Props: none
Uses: nothing (static status bar)

## ProfessionalScene
File: `components/professional-scene.tsx`
Props: none
Uses: nothing (static animated background)

## QuickFillDialog
File: `components/quick-fill-dialog.tsx`
Props: `{ open: boolean; onOpenChange: (open: boolean) => void; onQuickFill: (status: string, action: string) => void }`
Uses: nothing

## ScheduledComments
File: `components/scheduled-comments.tsx`
Props: none
Uses: trpc.scheduledComments.getAll/create/update/delete, CommentCard, CommentDialog

## SchedulerDialog
File: `components/scheduler-dialog.tsx`
Props: `{ open: boolean; onOpenChange: (open: boolean) => void }`
Uses: trpc.scheduler.getState, trpc.scheduler.setState, trpc.scheduler.triggerSchedule

## SchedulerPage
File: `components/scheduler-page.tsx`
Props: none
Uses: trpc.scheduler.getState/setState/getTriggerTimes/setTriggerTimes, trpc.settings.getShiftTokens/setShiftTokens/getCustomChannel/setCustomChannel, SchedulerStatus, ChannelSettings, ShiftConfig, ManualTrigger, TriggerTimesConfig

## SendSlackDialog
File: `components/send-slack-dialog.tsx`
Props: `{ open: boolean; onOpenChange: (open: boolean) => void; onSendSlack: () => Promise<void> }`
Uses: nothing

## ThemeProvider
File: `components/theme-provider.tsx`
Props: `{ children: ReactNode; initialTheme: Theme }`
Uses: nothing (provides ThemeContext)

## ThemeToggle
File: `components/theme-toggle.tsx`
Props: `{ variant?: "sidebar" | "header" }`
Uses: nothing (localStorage-based dark/light toggle)

## TicketFiltersComponent
File: `components/ticket-filters.tsx`
Props: `{ availableAssignees: string[]; availableStatuses: string[]; availableMainTypes: string[]; availableSubTypes: string[]; availableCustomerLevels: string[]; onFiltersChange: (filters: TicketFilters) => void }`
Uses: FilterForm, SavedFilters

## TicketPreview
File: `components/ticket-preview.tsx`
Props: `{ ticket: Ticket; isOpen: boolean; onClose: () => void; onMouseLeave?: () => void; anchorElement: HTMLElement | null }`
Uses: nothing

## TicketsTable
File: `components/tickets-table.tsx`
Props: `{ columns: ColumnDef<TData, TValue>[]; data: TData[]; actionButtons?: React.ReactNode; theme?: Theme }`
Uses: useTicketFilters, MobileTicketCard, DesktopTable, TicketPreview

## TRPCProvider
File: `components/trpc-provider.tsx`
Props: `{ children: React.ReactNode }`
Uses: generateChallengeHeaders, initChallengeSession (lib/security); exports `trpc` singleton

---

<!-- Backup components -->

## BackupStats
File: `components/backup/backup-stats.tsx`
Props: `{ total: number; auto: number; manual: number; latest: string }`
Uses: nothing

## BackupTable
File: `components/backup/backup-table.tsx`
Props: `{ backups: BackupItem[]; onRestore: (backup: BackupItem) => void }`
Uses: nothing

## RestoreDialog
File: `components/backup/restore-dialog.tsx`
Props: `{ open: boolean; onOpenChange: (open: boolean) => void; backup: BackupItem | null; restoring: boolean; onRestore: () => void }`
Uses: nothing

---

<!-- Feedback components -->

## AnonymousNotice
File: `components/feedback/anonymous-notice.tsx`
Props: none
Uses: nothing

## FeedbackDetailsCard
File: `components/feedback/feedback-details-card.tsx`
Props: `{ selectedType: FeedbackType | null; title: string; description: string; onTitleChange: (value: string) => void; onDescriptionChange: (value: string) => void }`
Uses: nothing

## FeedbackForm
File: `components/feedback/feedback-form.tsx`
Props: `{ onSuccess: () => void }`
Uses: trpc.feedback.create, FeedbackTypeSelector, FeedbackDetailsCard, AnonymousNotice

## FeedbackList
File: `components/feedback/feedback-list.tsx`
Props: `{ feedbackList: IFeedbackItem[]; isLoading: boolean; onRefresh: () => void; onSwitchToSubmit: () => void }`
Uses: nothing

## FeedbackSuccess
File: `components/feedback/feedback-success.tsx`
Props: `{ onSubmitAnother: () => void; onViewAll: () => void }`
Uses: nothing

## FeedbackTypeSelector
File: `components/feedback/feedback-type-selector.tsx`
Props: `{ selectedType: FeedbackType | null; onSelectType: (type: FeedbackType) => void }`
Uses: nothing

---

<!-- Filter components -->

## FilterForm
File: `components/filters/filter-form.tsx`
Props: `{ filters: TicketFilters; availableAssignees: string[]; availableStatuses: string[]; availableMainTypes: string[]; availableSubTypes: string[]; availableCustomerLevels: string[]; onFilterChange: (key: keyof TicketFilters, value: string) => void }`
Uses: FilterSelect

## FilterSelect
File: `components/filters/filter-select.tsx`
Props: `{ label: string; value: string; options: string[]; placeholder: string; onChange: (value: string) => void }` (via FilterSelectProps interface)
Uses: nothing

## SavedFilters
File: `components/filters/saved-filters.tsx`
Props: `{ savedFilters: SavedFilter[]; currentFilters: TicketFilters; activeFilterCount: number; onSave: (filter: SavedFilter) => void; onLoad: (filter: SavedFilter) => void; onDelete: (id: string) => void }`
Uses: nothing

---

<!-- Loading screen components -->

## ThemedLoading
File: `components/loading/index.tsx`
Props: none
Uses: DefaultLoading, ChristmasLoading, PixelLoading, LunarLoading, CodingLoading, ClashLoading, AngkorPixelLoading (CSS-based theme switching)

## AngkorPixelLoading
File: `components/loading/angkor-pixel-loading.tsx`
Props: none
Uses: nothing

## ChristmasLoading
File: `components/loading/christmas-loading.tsx`
Props: none
Uses: nothing

## ClashLoading
File: `components/loading/clash-loading.tsx`
Props: none
Uses: nothing

## CodingLoading
File: `components/loading/coding-loading.tsx`
Props: none
Uses: nothing

## DefaultLoading
File: `components/loading/default-loading.tsx`
Props: none
Uses: nothing

## LunarLoading
File: `components/loading/lunar-loading.tsx`
Props: none
Uses: nothing

## PixelLoading
File: `components/loading/pixel-loading.tsx`
Props: none
Uses: nothing

---

<!-- New Year / Christmas scene components -->

## FloatingDecorations
File: `components/new-year/floating-decorations.tsx`
Props: none
Uses: FLOATING_DECORATIONS constant

## Mailbox
File: `components/new-year/mailbox.tsx`
Props: `{ onClick: () => void }`
Uses: nothing

## NewYearScene (canonical)
File: `components/new-year/new-year-scene.tsx`
Props: none
Uses: useSnowflakes, useFireworks, FloatingDecorations, Mailbox, SantaMailModal

## SantaMailModal
File: `components/new-year/santa-mail-modal.tsx`
Props: `{ text: string; sign: string; onClose: () => void }`
Uses: nothing

---

<!-- Scheduled comments sub-components -->

## CommentCard
File: `components/scheduled-comments-parts/comment-card.tsx`
Props: `{ comment: IScheduledCommentItem; loading: boolean; onEdit: (comment: IScheduledCommentItem) => void; onDelete: (id: number) => void }`
Uses: nothing

## CommentDialog
File: `components/scheduled-comments-parts/comment-dialog.tsx`
Props: `{ open: boolean; onOpenChange: (open: boolean) => void; isEditing: boolean; formData: CommentFormData; loading: boolean; onFormChange: (data: Partial<CommentFormData>) => void; onSave: () => void }`
Uses: nothing

---

<!-- Scheduler sub-components -->

## ChannelSettings
File: `components/scheduler/channel-settings.tsx`
Props: `{ channelId: string; onChannelIdChange: (value: string) => void; onSave: () => void }`
Uses: nothing

## ManualTrigger
File: `components/scheduler/manual-trigger.tsx`
Props: `{ triggering: boolean; onTrigger: () => void }`
Uses: nothing

## SchedulerStatus
File: `components/scheduler/scheduler-status.tsx`
Props: `{ enabled: boolean; loading: boolean; onToggle: () => void }`
Uses: nothing

## ShiftConfig
File: `components/scheduler/shift-config.tsx`
Props: `{ variant: "evening" | "night"; token: string; mentions: string; onTokenChange: (value: string) => void; onMentionsChange: (value: string) => void }`
Uses: nothing

## TriggerTimesConfig
File: `components/scheduler/trigger-times-config.tsx`
Props: `{ eveningTime: string; nightTime: string; onEveningTimeChange: (value: string) => void; onNightTimeChange: (value: string) => void; onSave: () => void; isSaving?: boolean }`
Uses: nothing

---

<!-- Theme selector components -->

## ThemeButton
File: `components/theme/theme-button.tsx`
Props: `{ theme: IThemeInfo; isSelected: boolean; onSelect: (theme: Theme) => void; disabled: boolean }`
Uses: nothing

## ThemeList
File: `components/theme/theme-list.tsx`
Props: `{ themes: IThemeInfo[]; selectedTheme: Theme; onSelect: (theme: Theme) => void; disabled: boolean }`
Uses: ThemeButton

## ThemeSelector
File: `components/theme/theme-selector.tsx`
Props: `{ variant?: Theme }`
Uses: useTheme (hooks/theme/use-theme)

---

<!-- Tickets sub-components -->

## DesktopTable
File: `components/tickets/desktop-table.tsx`
Props: `{ table: TanstackTable<TData>; columns: ColumnDef<TData, TValue>[]; theme: Theme }`
Uses: getTableThemeStyles

## MobileTicketCard
File: `components/tickets/mobile-ticket-card.tsx`
Props: `{ row: Row<TData>; index: number; theme: Theme }`
Uses: nothing
