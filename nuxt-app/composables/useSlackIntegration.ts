import type { Ticket } from '~/types/ticket'

const DEFAULT_VALUE = '--'

interface UseSlackIntegrationOptions {
  tickets: Ref<Ticket[]>
  ticketData: Ref<Record<string, string>>
}

interface UseSlackIntegrationReturn {
  handleSendSlack: () => Promise<void>
  handleCopyForSlack: () => Promise<void>
  isSending: Ref<boolean>
}

export function useSlackIntegration({
  tickets,
  ticketData,
}: UseSlackIntegrationOptions): UseSlackIntegrationReturn {
  const isSending = ref(false)
  const config = useRuntimeConfig()

  const handleSendSlack = async () => {
    isSending.value = true
    try {
      const ticketDetails: Record<string, Record<string, unknown>> = {}
      tickets.value.forEach((ticket) => {
        ticketDetails[ticket.key] = {
          summary: ticket.summary,
          status: ticket.status,
          assignee: ticket.assignee,
          created: ticket.created,
          dueDate: ticket.dueDate ?? undefined,
          wlMainTicketType: ticket.wlMainTicketType,
          wlSubTicketType: ticket.wlSubTicketType,
          customerLevel: ticket.customerLevel,
        }
      })

      await $fetch('/api/slack/send', {
        method: 'POST',
        body: {
          ticketData: ticketData.value,
          ticketDetails,
        },
      })

      // TODO: Add toast notification and confetti
      console.info('[Slack] Successfully sent to Slack')
    } catch (err) {
      console.error('[Slack] Error sending to Slack:', err)
      throw err
    } finally {
      isSending.value = false
    }
  }

  const handleCopyForSlack = async () => {
    const JIRA_URL = config.public.jiraUrl || 'https://olympian.atlassian.net'
    if (!JIRA_URL) {
      console.error('[Slack] JIRA_URL not configured')
      return
    }

    const ticketKeys = Object.keys(ticketData.value)
      .filter((key) => key.startsWith('status-'))
      .map((key) => key.replace('status-', ''))

    const filledTickets = ticketKeys.filter((ticketKey) => {
      const status = ticketData.value[`status-${ticketKey}`]
      const action = ticketData.value[`action-${ticketKey}`]
      return status !== DEFAULT_VALUE || action !== DEFAULT_VALUE
    })

    if (filledTickets.length === 0) {
      console.warn('[Slack] No tickets with filled status or action')
      return
    }

    const messages = filledTickets.map((ticketKey, index) => {
      const status = ticketData.value[`status-${ticketKey}`]
      const action = ticketData.value[`action-${ticketKey}`]
      const ticket = tickets.value.find((t) => t.key === ticketKey)
      if (!ticket) return ''

      const ticketUrl = `${JIRA_URL}/browse/${ticketKey}`

      return [
        `--- Ticket ${index + 1} ---`,
        `Ticket Link: <${ticketUrl}> ${ticket.summary}`,
        `WL Main Type: ${ticket.wlMainTicketType}`,
        `WL Sub Type: ${ticket.wlSubTicketType}`,
        `Status: ${status}`,
        `Action: ${action}`,
        '',
      ].join('\n')
    })

    await navigator.clipboard.writeText(messages.join('').trim())
    console.info(`[Slack] Copied ${filledTickets.length} ticket(s) to clipboard`)
  }

  return {
    handleSendSlack,
    handleCopyForSlack,
    isSending: isSending as Ref<boolean>,
  }
}
