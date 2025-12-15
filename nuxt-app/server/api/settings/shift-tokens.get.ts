import { getSettingsService } from '../../services/settings.service'

export default defineEventHandler(async () => {
  const settingsService = getSettingsService()

  const eveningToken = await settingsService.getEveningUserToken()
  const nightToken = await settingsService.getNightUserToken()
  const eveningMentions = await settingsService.getEveningMentions()
  const nightMentions = await settingsService.getNightMentions()

  return {
    success: true,
    data: {
      eveningToken: eveningToken || '',
      nightToken: nightToken || '',
      eveningMentions: eveningMentions || '',
      nightMentions: nightMentions || '',
    },
  }
})
