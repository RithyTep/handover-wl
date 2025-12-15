import { ScheduledCommentService } from '../../services/scheduled-comment.service'

const service = new ScheduledCommentService()

export default defineEventHandler(async () => {
  const comments = await service.getAllItems()
  return { success: true, comments }
})
