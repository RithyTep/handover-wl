import { getTicketService } from '../../services/ticket.service'

export default defineEventHandler(async () => {
  const ticketService = getTicketService()
  const data = await ticketService.loadTicketData()

  return {
    success: true,
    data,
  }
})
