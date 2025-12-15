import { checkHealth } from '../../services/slack.service'

export default defineEventHandler(async () => {
  const health = await checkHealth()

  return {
    success: true,
    slack: health,
  }
})
