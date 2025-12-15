import { getSettingsService } from '../../services/settings.service'
import { shiftTokensSchema } from '~/types/settings'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = shiftTokensSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid shift tokens input',
    })
  }

  const settingsService = getSettingsService()

  if (parsed.data.evening_user_token) {
    await settingsService.setEveningUserToken(parsed.data.evening_user_token)
  }
  if (parsed.data.night_user_token) {
    await settingsService.setNightUserToken(parsed.data.night_user_token)
  }
  if (parsed.data.evening_mentions) {
    await settingsService.setEveningMentions(parsed.data.evening_mentions)
  }
  if (parsed.data.night_mentions) {
    await settingsService.setNightMentions(parsed.data.night_mentions)
  }

  return { success: true }
})
