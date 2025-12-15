import { z } from 'zod'
import { postThreadReply } from '../../services/slack.service'

const inputSchema = z.object({
  channelId: z.string().min(1),
  threadTs: z.string().min(1),
  text: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = inputSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid input: channelId, threadTs, and text are required',
    })
  }

  const { channelId, threadTs, text } = parsed.data
  const result = await postThreadReply(text, threadTs, channelId)

  if (!result.ok) {
    throw createError({
      statusCode: 500,
      message: result.error || 'Failed to post thread reply',
    })
  }

  return { success: true, ts: result.ts }
})
