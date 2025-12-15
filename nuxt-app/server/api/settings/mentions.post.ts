import { getSettingsService } from '../../services/settings.service'
import { memberMentionsSchema } from '~/types/settings'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = memberMentionsSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid mentions input',
    })
  }

  const settingsService = getSettingsService()
  await settingsService.setMemberMentions(parsed.data.mentions)

  return {
    success: true,
    mentions: parsed.data.mentions,
  }
})
