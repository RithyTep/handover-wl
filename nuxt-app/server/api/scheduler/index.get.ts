import { getSettingsService } from '~/server/services/settings.service'

export default defineEventHandler(async () => {
  const settingsService = getSettingsService()
  const enabled = await settingsService.getSchedulerEnabled()
  return { enabled }
})
