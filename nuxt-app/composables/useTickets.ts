import type { Ticket } from '~/types/ticket'

interface UseTicketsOptions {
  initialTickets?: Ticket[]
}

interface UseTicketsReturn {
  tickets: Ref<Ticket[]>
  isLoading: Ref<boolean>
  error: Ref<Error | null>
  refetch: () => Promise<void>
}

export function useTickets(options: UseTicketsOptions = {}): UseTicketsReturn {
  const { initialTickets } = options
  const hasInitialData = initialTickets && initialTickets.length > 0

  const tickets = ref<Ticket[]>(initialTickets ?? [])
  const isLoading = ref(!hasInitialData)
  const error = ref<Error | null>(null)

  const fetchTickets = async () => {
    if (hasInitialData && tickets.value.length > 0) {
      isLoading.value = false
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; tickets: Ticket[] }>('/api/tickets')
      if (response.success) {
        tickets.value = response.tickets
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to fetch tickets')
      console.error('[useTickets] Error fetching tickets:', err)
    } finally {
      isLoading.value = false
    }
  }

  const refetch = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; tickets: Ticket[] }>('/api/tickets')
      if (response.success) {
        tickets.value = response.tickets
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to fetch tickets')
    } finally {
      isLoading.value = false
    }
  }

  // Fetch on mount if no initial data
  onMounted(() => {
    if (!hasInitialData) {
      fetchTickets()
    }
  })

  return {
    tickets: tickets as Ref<Ticket[]>,
    isLoading: isLoading as Ref<boolean>,
    error: error as Ref<Error | null>,
    refetch,
  }
}
