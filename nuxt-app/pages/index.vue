<script setup lang="ts">
import { DashboardHeader, DashboardActions, DashboardMobileActions } from '~/components/dashboard'
import { TicketsTable } from '~/components/tickets'
import { ThemeSelector } from '~/components/theme'
import { QuickFillDialog, ClearDialog, SendSlackDialog } from '~/components/dialogs'
import { createColumns } from '~/components/tickets/columns'
import { Theme } from '~/enums'
import { getLayoutConfig } from '~/lib/theme'
import { cn } from '~/lib/utils'

// Fetch tickets from API
const { tickets, isLoading, error, refetch } = useTickets()

// Theme management
const { selectedTheme } = useTheme()
const currentTheme = computed(() => (selectedTheme.value as Theme) ?? Theme.DEFAULT)

// Ticket actions
const {
  ticketData,
  updateTicketData,
  renderKey,
  handleSave,
  handleSendSlack,
  handleAIFillAll,
  handleCopyForSlack,
  handleQuickFill,
  handleClear,
  isSaving,
  isSendingSlack,
  isAIProcessing,
} = useTicketActions({ tickets })

// Dialog states
const quickFillOpen = ref(false)
const clearOpen = ref(false)
const sendSlackOpen = ref(false)

// Columns for the table
const columns = computed(() =>
  createColumns({
    ticketData: ticketData.value,
    updateTicketData,
    renderKey: renderKey.value,
  })
)

// Layout config
const layoutConfig = computed(() => getLayoutConfig(currentTheme.value))

// Apply theme class to body
watchEffect(() => {
  if (import.meta.client) {
    document.body.classList.remove(
      'theme-christmas',
      'theme-default',
      'theme-pixel',
      'theme-lunar',
      'theme-coding',
      'theme-clash',
      'theme-angkor_pixel'
    )
    document.body.classList.add(`theme-${currentTheme.value}`)
  }
})

// Dialog handlers
const handleOpenQuickFill = () => {
  quickFillOpen.value = true
}

const handleOpenClear = () => {
  clearOpen.value = true
}

const handleOpenSendSlack = () => {
  sendSlackOpen.value = true
}

const handleQuickFillConfirm = (status: string, action: string) => {
  handleQuickFill(status, action)
}

const handleClearConfirm = () => {
  handleClear()
  clearOpen.value = false
}

const handleSendSlackConfirm = async () => {
  await handleSendSlack()
  sendSlackOpen.value = false
}
</script>

<template>
  <div
    :class="cn('h-dvh flex flex-col overflow-hidden relative', layoutConfig.background)"
    role="main"
  >
    <DashboardHeader :theme="currentTheme" :ticket-count="tickets.length">
      <template #theme-selector>
        <ThemeSelector :variant="currentTheme" />
      </template>
    </DashboardHeader>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="text-muted-foreground">Loading tickets...</div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center">
      <div class="text-red-500">Error loading tickets: {{ error.message }}</div>
    </div>

    <!-- Main content -->
    <main
      v-else
      :class="[
        'flex-1 overflow-hidden px-4 sm:px-6 py-9 sm:py-4 pb-20 sm:pb-4 relative z-10',
        currentTheme === 'pixel' ? 'pb-12' : '',
      ]"
    >
      <TicketsTable :columns="columns" :data="tickets" :theme="currentTheme">
        <template #actions>
          <DashboardActions
            :theme="currentTheme"
            @ai-fill-all="handleAIFillAll"
            @quick-fill="handleOpenQuickFill"
            @clear="handleOpenClear"
            @refresh="refetch"
            @copy="handleCopyForSlack"
            @save="handleSave"
            @send-slack="handleOpenSendSlack"
          />
        </template>
      </TicketsTable>
    </main>

    <!-- Mobile actions -->
    <DashboardMobileActions
      :theme="currentTheme"
      @ai-fill-all="handleAIFillAll"
      @quick-fill="handleOpenQuickFill"
      @clear="handleOpenClear"
      @save="handleSave"
      @send-slack="handleOpenSendSlack"
    />

    <!-- Dialogs -->
    <QuickFillDialog
      v-model:open="quickFillOpen"
      @quick-fill="handleQuickFillConfirm"
    />
    <ClearDialog v-model:open="clearOpen" @clear-all="handleClearConfirm" />
    <SendSlackDialog v-model:open="sendSlackOpen" @send-slack="handleSendSlackConfirm" />
  </div>
</template>
