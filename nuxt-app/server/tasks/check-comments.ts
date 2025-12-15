import { ScheduledCommentRepository } from '../repository/scheduled-comment.repository'
import { shouldRunCronNow } from '../utils/cron-utils'
import { getSettingsService } from '../services/settings.service'
import { getEnv } from '../utils/env'

export default defineTask({
  meta: {
    name: 'check-comments',
    description: 'Checks and posts scheduled comments every minute',
  },
  async run() {
    const settingsService = getSettingsService()
    const isEnabled = await settingsService.getSchedulerEnabled()

    if (!isEnabled) {
      return { result: { skipped: true, reason: 'Scheduler disabled' } }
    }

    try {
      const commentRepo = new ScheduledCommentRepository()
      const scheduledComments = await commentRepo.findEnabled()
      const jiraComments = scheduledComments.filter((c) => c.comment_type === 'jira')

      if (jiraComments.length === 0) {
        return { result: { success: true, posted: 0 } }
      }

      const now = new Date()
      const env = getEnv()
      let postedCount = 0

      for (const comment of jiraComments) {
        try {
          const shouldRun = shouldRunCronNow(
            comment.cron_schedule,
            comment.last_posted_at,
            now
          )

          if (shouldRun && comment.ticket_key) {
            console.info('[Scheduler] Posting scheduled comment', {
              commentId: comment.id,
              ticketKey: comment.ticket_key,
            })

            // Post to Jira API
            const jiraUrl = env.jiraUrl
            const jiraEmail = env.jiraEmail
            const jiraToken = env.jiraToken

            if (jiraUrl && jiraEmail && jiraToken) {
              const response = await fetch(
                `${jiraUrl}/rest/api/3/issue/${comment.ticket_key}/comment`,
                {
                  method: 'POST',
                  headers: {
                    Authorization: `Basic ${Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64')}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    body: {
                      type: 'doc',
                      version: 1,
                      content: [
                        {
                          type: 'paragraph',
                          content: [{ type: 'text', text: comment.comment_text }],
                        },
                      ],
                    },
                  }),
                }
              )

              if (response.ok) {
                await commentRepo.updateLastPosted(comment.id)
                postedCount++
                console.info('[Scheduler] Scheduled comment posted', { commentId: comment.id })
              }
            }
          }
        } catch (error: unknown) {
          const errMsg = error instanceof Error ? error.message : 'Unknown error'
          console.error('[Scheduler] Failed to post comment', {
            commentId: comment.id,
            error: errMsg,
          })
        }
      }

      return { result: { success: true, posted: postedCount } }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error('[Scheduler] Comment check failed', { error: message })
      return { result: { success: false, error: message } }
    }
  },
})
