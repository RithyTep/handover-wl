import { z } from 'zod'
import { getTicketService } from '../../services/ticket.service'

const inputSchema = z.record(z.string(), z.string())

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate input
  const parsed = inputSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid input format',
    })
  }

  const input = parsed.data
  const formattedData: Record<string, { status: string, action: string }> = {}

  for (const [key, value] of Object.entries(input)) {
    const isStatus = key.startsWith('status-')
    const isAction = key.startsWith('action-')

    if (!isStatus && !isAction) continue

    const ticketKey = key.replace(/^(status|action)-/, '')
    if (!formattedData[ticketKey]) {
      formattedData[ticketKey] = { status: '--', action: '--' }
    }

    if (isStatus) formattedData[ticketKey].status = value
    if (isAction) formattedData[ticketKey].action = value
  }

  const ticketService = getTicketService()
  await ticketService.saveTicketData(formattedData)

  return {
    success: true,
    ticketCount: Object.keys(formattedData).length,
  }
})
