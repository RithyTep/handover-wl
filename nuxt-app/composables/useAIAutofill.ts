import type { Ticket } from '~/types/ticket'

const BATCH_SIZE = 3
const DEFAULT_VALUE = '--'

interface TicketUpdate {
  ticketKey: string
  status?: string
  action?: string
}

interface UseAIAutofillOptions {
  tickets: Ref<Ticket[]>
  ticketData: Ref<Record<string, string>>
  setTicketData: (data: Record<string, string>) => void
  triggerRerender: () => void
}

interface UseAIAutofillReturn {
  handleAIFillAll: () => Promise<void>
  isProcessing: Ref<boolean>
}

export function useAIAutofill({
  tickets,
  ticketData,
  setTicketData,
  triggerRerender,
}: UseAIAutofillOptions): UseAIAutofillReturn {
  const isProcessing = ref(false)

  const handleAIFillAll = async () => {
    const missingTickets = tickets.value.filter((ticket) => {
      const status = ticketData.value[`status-${ticket.key}`]
      const action = ticketData.value[`action-${ticket.key}`]
      return !status || status === DEFAULT_VALUE || !action || action === DEFAULT_VALUE
    })

    if (missingTickets.length === 0) {
      console.info('[AI] All tickets already have status and action filled')
      return
    }

    isProcessing.value = true
    console.info(`[AI] Filling ${missingTickets.length} ticket(s)...`)

    try {
      const newData = { ...ticketData.value }
      const updates: TicketUpdate[] = []
      let successCount = 0
      let errorCount = 0

      for (let i = 0; i < missingTickets.length; i += BATCH_SIZE) {
        const batch = missingTickets.slice(i, i + BATCH_SIZE)
        const batchEnd = Math.min(i + BATCH_SIZE, missingTickets.length)

        console.info(`[AI] Processing batch ${i + 1}-${batchEnd} of ${missingTickets.length}...`)

        const batchResults = await Promise.allSettled(
          batch.map(async (ticket) => {
            const result = await $fetch<{ suggestion: { status: string; action: string } }>('/api/ai/autofill', {
              method: 'POST',
              body: {
                ticket: {
                  ...ticket,
                  dueDate: ticket.dueDate ?? undefined,
                },
              },
            })
            return { ticket, suggestion: result.suggestion }
          })
        )

        batchResults.forEach((result) => {
          if (result.status === 'fulfilled') {
            const { ticket, suggestion } = result.value
            const currentStatus = ticketData.value[`status-${ticket.key}`]
            const currentAction = ticketData.value[`action-${ticket.key}`]

            const update: TicketUpdate = { ticketKey: ticket.key }

            if (!currentStatus || currentStatus === DEFAULT_VALUE) {
              newData[`status-${ticket.key}`] = suggestion.status
              update.status = suggestion.status
            }
            if (!currentAction || currentAction === DEFAULT_VALUE) {
              newData[`action-${ticket.key}`] = suggestion.action
              update.action = suggestion.action
            }

            updates.push(update)
            successCount++
          } else {
            errorCount++
          }
        })
      }

      setTicketData(newData)
      triggerRerender()

      if (errorCount === 0) {
        console.info(`[AI] Successfully filled ${successCount} ticket(s)`)
        // TODO: Add confetti and toast
      } else {
        console.warn(`[AI] Filled ${successCount} ticket(s), ${errorCount} failed`)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error(`[AI] Error during AI fill: ${message}`)
      throw error
    } finally {
      isProcessing.value = false
    }
  }

  return {
    handleAIFillAll,
    isProcessing: isProcessing as Ref<boolean>,
  }
}
