import { z } from 'zod'
import { getSettingsService } from '~/server/services/settings.service'

const triggerTimesSchema = z.object({
  time1: z.string(),
  time2: z.string(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = triggerTimesSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.message,
    })
  }

  const settingsService = getSettingsService()
  await settingsService.setTriggerTimes(parsed.data.time1, parsed.data.time2)

  return { success: true }
})
