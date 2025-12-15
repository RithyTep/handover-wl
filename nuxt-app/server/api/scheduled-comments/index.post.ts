import { z } from 'zod'
import { ScheduledCommentService } from '../../services/scheduled-comment.service'
import { CommentType } from '~/enums'

const createSchema = z.object({
  comment_type: z.nativeEnum(CommentType),
  comment_text: z.string().min(1, 'Comment text is required'),
  cron_schedule: z.string().min(1, 'Cron schedule is required'),
  enabled: z.boolean(),
  ticket_key: z.string().optional(),
})

const service = new ScheduledCommentService()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.message,
    })
  }

  const comment = await service.create({
    commentType: parsed.data.comment_type,
    commentText: parsed.data.comment_text,
    cronSchedule: parsed.data.cron_schedule,
    enabled: parsed.data.enabled,
    ticketKey: parsed.data.ticket_key,
  })

  return { success: true, comment }
})
