import { getTicketService } from '../../services/ticket.service'
import { getTicketsWithSavedData } from '../../services/jira.service'
import type { Ticket } from '~/types'

// In-memory cache for tickets
interface TicketsCache {
  tickets: Ticket[]
  timestamp: number
}

let ticketsCache: TicketsCache | null = null
const TICKETS_CACHE_TTL = 30000 // 30 seconds

export default defineEventHandler(async () => {
  const now = Date.now()

  // Return cached data if still valid
  if (ticketsCache && now - ticketsCache.timestamp < TICKETS_CACHE_TTL) {
    return {
      success: true,
      tickets: ticketsCache.tickets,
      total: ticketsCache.tickets.length,
      storage: 'postgresql',
      cached: true,
    }
  }

  // Fetch fresh data
  const ticketService = getTicketService()
  const savedData = await ticketService.loadTicketData()
  const tickets = await getTicketsWithSavedData(savedData)

  // Update cache
  ticketsCache = { tickets, timestamp: now }

  return {
    success: true,
    tickets,
    total: tickets.length,
    storage: 'postgresql',
    cached: false,
  }
})
