import { z } from 'zod'
import { FeedbackType } from '~/enums'
import { FeedbackService } from '~/server/services/feedback.service'

const feedbackService = new FeedbackService()

const createFeedbackSchema = z.object({
  type: z.nativeEnum(FeedbackType),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = createFeedbackSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.message,
    })
  }

  const { type, title, description } = parsed.data

  try {
    const feedback = await feedbackService.create(type, title, description)
    return { success: true, data: feedback }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: (error as Error).message,
    })
  }
})
