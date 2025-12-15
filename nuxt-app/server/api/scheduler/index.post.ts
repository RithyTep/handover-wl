import { z } from 'zod'
import { getSettingsService } from '~/server/services/settings.service'

const schedulerStateSchema = z.object({
  enabled: z.boolean(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = schedulerStateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.message,
    })
  }

  const settingsService = getSettingsService()
  await settingsService.setSchedulerEnabled(parsed.data.enabled)

  return { success: true, enabled: parsed.data.enabled }
})
