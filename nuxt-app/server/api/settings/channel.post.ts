import { getSettingsService } from '../../services/settings.service'
import { customChannelSchema } from '~/types/settings'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = customChannelSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: 'Channel ID is required',
    })
  }

  const settingsService = getSettingsService()
  await settingsService.setCustomChannelId(parsed.data.channel_id)

  return {
    success: true,
    channelId: parsed.data.channel_id,
  }
})
