import { z } from 'zod'
import { ScheduledCommentService } from '../../services/scheduled-comment.service'
import { CommentType } from '~/enums'

const updateSchema = z.object({
  comment_type: z.nativeEnum(CommentType),
  comment_text: z.string().min(1, 'Comment text is required'),
  cron_schedule: z.string().min(1, 'Cron schedule is required'),
  enabled: z.boolean(),
  ticket_key: z.string().optional(),
})

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

  const body = await readBody(event)

  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.message,
    })
  }

  const comment = await service.update({
    id,
    commentType: parsed.data.comment_type,
    commentText: parsed.data.comment_text,
    cronSchedule: parsed.data.cron_schedule,
    enabled: parsed.data.enabled,
    ticketKey: parsed.data.ticket_key,
  })

  if (!comment) {
    throw createError({
      statusCode: 404,
      message: 'Comment not found',
    })
  }

  return { success: true, comment }
})
