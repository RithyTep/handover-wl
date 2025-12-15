import { ScheduledCommentService } from '../../services/scheduled-comment.service'

const service = new ScheduledCommentService()

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')
  const id = parseInt(idParam || '', 10)

  if (isNaN(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      message: 'Invalid comment ID',
    })
  }

  const deleted = await service.delete(id)

  if (!deleted) {
    throw createError({
      statusCode: 404,
      message: 'Comment not found',
    })
  }

  return { success: true }
})
