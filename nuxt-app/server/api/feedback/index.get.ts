import { FeedbackService } from '~/server/services/feedback.service'

const feedbackService = new FeedbackService()

export default defineEventHandler(async () => {
  const feedback = await feedbackService.getAllItems()
  return { success: true, feedback }
})
