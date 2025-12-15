import { z } from 'zod'
import { getEnv } from '../../utils/env'
import { getTicketService } from '../../services/ticket.service'

const inputSchema = z.object({
  ticketData: z.record(z.string(), z.string()),
  ticketDetails: z.record(z.string(), z.unknown()),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = inputSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid input',
    })
  }

  const env = getEnv()
  const { ticketData, ticketDetails } = parsed.data

  if (!env.slackBotToken || !env.slackChannelId) {
    throw createError({
      statusCode: 500,
      message: 'Missing SLACK_BOT_TOKEN or SLACK_CHANNEL',
    })
  }

  // Save ticket data to database
  const ticketService = getTicketService()
  const dataToSave: Record<string, { status: string; action: string }> = {}

  const ticketKeys = Object.keys(ticketData)
    .filter((key) => key.startsWith('status-'))
    .map((key) => key.replace('status-', ''))

  ticketKeys.forEach((ticketKey) => {
    dataToSave[ticketKey] = {
      status: ticketData[`status-${ticketKey}`] || '--',
      action: ticketData[`action-${ticketKey}`] || '--',
    }
  })

  await ticketService.saveTicketData(dataToSave)

  // Build message
  let message = 'Please refer to this ticket information\n\n'

  ticketKeys.forEach((ticketKey, index) => {
    const status = ticketData[`status-${ticketKey}`] || '--'
    const action = ticketData[`action-${ticketKey}`] || '--'
    const details = (ticketDetails?.[ticketKey] || {}) as Record<string, unknown>
    const summary = (details.summary as string) || ''
    const wlMainType = (details.wlMainTicketType as string) || '--'
    const wlSubType = (details.wlSubTicketType as string) || '--'
    const ticketUrl = `${env.jiraUrl}/browse/${ticketKey}`

    message += `--- Ticket ${index + 1} ---\n`
    message += `Ticket Link: <${ticketUrl}|${ticketKey}> ${summary}\n`
    message += `WL Main Type: ${wlMainType}\n`
    message += `WL Sub Type: ${wlSubType}\n`
    message += `Status: ${status}\n`
    message += `Action: ${action}\n`
    message += `\n`
  })
  message += `===========================\n`

  // Post to Slack
  const postResponse = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.slackBotToken}`,
    },
    body: JSON.stringify({
      channel: env.slackChannelId,
      text: message.trim(),
      unfurl_links: false,
      unfurl_media: false,
    }),
  })

  const postResult = (await postResponse.json()) as { ok: boolean; error?: string; ts?: string }

  if (!postResult.ok) {
    throw createError({
      statusCode: 500,
      message: postResult.error || 'Failed to post to Slack',
    })
  }

  return { success: true, message_ts: postResult.ts }
})
