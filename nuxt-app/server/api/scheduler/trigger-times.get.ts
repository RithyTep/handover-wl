import { getSettingsService } from '~/server/services/settings.service'

export default defineEventHandler(async () => {
  const settingsService = getSettingsService()
  const times = await settingsService.getTriggerTimes()
  return times
})
