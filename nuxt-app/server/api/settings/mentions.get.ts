import { getSettingsService } from '../../services/settings.service'

export default defineEventHandler(async () => {
  const settingsService = getSettingsService()
  const mentions = await settingsService.getMemberMentions()

  return {
    success: true,
    mentions: mentions || '',
  }
})
