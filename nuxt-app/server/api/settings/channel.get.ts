import { getSettingsService } from '../../services/settings.service'

export default defineEventHandler(async () => {
  const settingsService = getSettingsService()
  const channelId = await settingsService.getCustomChannelId()

  return {
    success: true,
    channelId,
  }
})
