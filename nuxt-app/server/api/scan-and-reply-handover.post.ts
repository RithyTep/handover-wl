import { HandoverService } from '../services/handover.service'

const handoverService = new HandoverService()

export default defineEventHandler(async () => {
  const result = await handoverService.scanAndReplyToHandover()

  if (!result.success) {
    throw createError({
      statusCode: 500,
      message: result.message,
      data: { error: result.error },
    })
  }

  return {
    success: result.success,
    replied: result.replied,
    message: result.message,
    handoverMessageTs: result.handoverMessageTs,
    replyTs: result.replyTs,
    ticketsCount: result.ticketsCount,
  }
})
