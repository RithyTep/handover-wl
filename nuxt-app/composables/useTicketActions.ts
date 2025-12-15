import type { Ticket } from '~/types/ticket'

interface UseTicketActionsProps {
  tickets: Ref<Ticket[]>
}

interface UseTicketActionsReturn {
  ticketData: Ref<Record<string, string>>
  updateTicketData: (key: string, value: string) => void
  renderKey: Ref<number>
  handleSave: () => Promise<void>
  handleSendSlack: () => Promise<void>
  handleAIFillAll: () => Promise<void>
  handleCopyForSlack: () => Promise<void>
  handleQuickFill: (status: string, action: string) => void
  handleClear: () => void
  isSaving: Ref<boolean>
  isSendingSlack: Ref<boolean>
  isAIProcessing: Ref<boolean>
}

const DEFAULT_VALUE = '--'

export function useTicketActions({ tickets }: UseTicketActionsProps): UseTicketActionsReturn {
  const ticketData = ref<Record<string, string>>({})
  const renderKey = ref(0)
  const isSaving = ref(false)
  const hasInitialized = ref(false)

  // Initialize from saved data
  watch(
    tickets,
    (newTickets) => {
      if (newTickets.length === 0 || hasInitialized.value) return

      const initialData: Record<string, string> = {}
      newTickets.forEach((ticket) => {
        if (ticket.savedStatus && ticket.savedStatus !== DEFAULT_VALUE) {
          initialData[`status-${ticket.key}`] = ticket.savedStatus
        }
        if (ticket.savedAction && ticket.savedAction !== DEFAULT_VALUE) {
          initialData[`action-${ticket.key}`] = ticket.savedAction
        }
      })

      if (Object.keys(initialData).length > 0) {
        ticketData.value = initialData
        renderKey.value++
      }
      hasInitialized.value = true
    },
    { immediate: true }
  )

  const updateTicketData = (key: string, value: string) => {
    ticketData.value = { ...ticketData.value, [key]: value }
  }

  const setTicketData = (data: Record<string, string>) => {
    ticketData.value = data
  }

  const triggerRerender = () => {
    renderKey.value++
  }

  // AI Autofill integration
  const { handleAIFillAll: aiAutofill, isProcessing: isAIProcessing } = useAIAutofill({
    tickets,
    ticketData,
    setTicketData,
    triggerRerender,
  })

  // Slack integration
  const { handleSendSlack: sendSlack, handleCopyForSlack, isSending: isSendingSlack } = useSlackIntegration({
    tickets,
    ticketData,
  })

  const handleSave = async () => {
    isSaving.value = true
    console.info('[TicketActions] Saving ticket data...')

    try {
      await $fetch('/api/ticket-data', {
        method: 'POST',
        body: ticketData.value,
      })

      console.info('[TicketActions] Successfully saved ticket data')
      // TODO: Add confetti and toast
    } catch (err) {
      console.error('[TicketActions] Error saving:', err)
      throw err
    } finally {
      isSaving.value = false
    }
  }

  const handleSendSlack = async () => {
    await sendSlack()
  }

  const handleAIFillAll = async () => {
    await aiAutofill()
  }

  const handleQuickFill = (status: string, action: string) => {
    const newData = { ...ticketData.value }
    tickets.value.forEach((ticket) => {
      newData[`status-${ticket.key}`] = status
      newData[`action-${ticket.key}`] = action
    })
    ticketData.value = newData
    renderKey.value++
    console.info('[TicketActions] Quick fill applied')
    // TODO: Add confetti and toast
  }

  const handleClear = () => {
    const newData: Record<string, string> = {}
    Object.keys(ticketData.value).forEach((key) => {
      newData[key] = DEFAULT_VALUE
    })
    ticketData.value = newData
    renderKey.value++
    console.info('[TicketActions] All fields cleared')
    // TODO: Add toast
  }

  return {
    ticketData: ticketData as Ref<Record<string, string>>,
    updateTicketData,
    renderKey: renderKey as Ref<number>,
    handleSave,
    handleSendSlack,
    handleAIFillAll,
    handleCopyForSlack,
    handleQuickFill,
    handleClear,
    isSaving: isSaving as Ref<boolean>,
    isSendingSlack: isSendingSlack as Ref<boolean>,
    isAIProcessing: isAIProcessing as Ref<boolean>,
  }
}
