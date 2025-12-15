import { getEnv } from '../utils/env'
import { getSettingsService } from './settings.service'
import { TicketService } from './ticket.service'
import {
  postMessage,
  postThreadReply,
  getHistory,
  getThreadReplies,
  formatDate,
  formatTime,
} from './slack.service'
import { ScheduledCommentRepository } from '../repository/scheduled-comment.repository'
import type { Ticket } from '~/types'

const HANDOVER_MARKER = '<!-- handover-message -->'

export interface ScanAndReplyResult {
  success: boolean
  replied: boolean
  message: string
  handoverMessageTs?: string
  replyTs?: string
  ticketsCount?: number
  error?: string
}

interface TicketMessageData {
  key: string
  summary: string
  wlMainTicketType: string
  wlSubTicketType: string
  savedStatus: string
  savedAction: string
}

function formatTicketMessage(
  tickets: TicketMessageData[],
  options: { mentions?: string; includeFooter?: boolean } = {}
): string {
  const { mentions, includeFooter = true } = options

  const lines: string[] = []

  if (mentions) {
    lines.push(mentions)
    lines.push('')
  }

  lines.push(`*Handover Report - ${formatDate()}*`)
  lines.push(`_Generated at ${formatTime()}_`)
  lines.push('')

  if (tickets.length === 0) {
    lines.push('No tickets to report.')
  } else {
    lines.push(`*${tickets.length} Tickets:*`)
    lines.push('')

    tickets.forEach((ticket, index) => {
      lines.push(`*${index + 1}. ${ticket.key}*`)
      lines.push(`> ${ticket.summary}`)
      lines.push(`> Type: ${ticket.wlMainTicketType} / ${ticket.wlSubTicketType}`)
      lines.push(`> Status: ${ticket.savedStatus}`)
      lines.push(`> Action: ${ticket.savedAction}`)
      lines.push('')
    })
  }

  if (includeFooter) {
    lines.push(HANDOVER_MARKER)
  }

  return lines.join('\n')
}

function convertTicketsToMessageData(tickets: Ticket[]): TicketMessageData[] {
  return tickets.map((ticket) => ({
    key: ticket.key,
    summary: ticket.summary,
    wlMainTicketType: ticket.wlMainTicketType || '--',
    wlSubTicketType: ticket.wlSubTicketType || '--',
    savedStatus: ticket.savedStatus || '--',
    savedAction: ticket.savedAction || '--',
  }))
}

export class HandoverService {
  private ticketService: TicketService
  private settingsService: ReturnType<typeof getSettingsService>
  private scheduledCommentRepo: ScheduledCommentRepository

  constructor() {
    this.ticketService = new TicketService()
    this.settingsService = getSettingsService()
    this.scheduledCommentRepo = new ScheduledCommentRepository()
  }

  private async getChannelId(): Promise<string | null> {
    const customChannelId = await this.settingsService.getCustomChannelId()
    if (customChannelId) return customChannelId

    const env = getEnv()
    return env.slackChannelId || null
  }

  private async getUserToken(): Promise<string | null> {
    const env = getEnv()
    return env.slackUserToken || null
  }

  private async findHandoverMessage(
    channelId: string,
    limit: number = 10
  ): Promise<{ found: boolean; messageTs?: string; hasReplies: boolean }> {
    const historyResponse = await getHistory(channelId, limit)

    if (!historyResponse.ok || !historyResponse.messages) {
      console.warn('[Handover] Failed to fetch channel history', {
        error: historyResponse.error,
      })
      return { found: false, hasReplies: false }
    }

    const handoverMessage = historyResponse.messages.find(
      (msg: { text?: string }) =>
        msg.text && msg.text.includes(HANDOVER_MARKER)
    )

    if (!handoverMessage) {
      console.debug('[Handover] No handover message found')
      return { found: false, hasReplies: false }
    }

    const repliesResponse = await getThreadReplies(handoverMessage.ts, channelId)

    const hasReplies = Boolean(
      repliesResponse.ok &&
        repliesResponse.messages &&
        repliesResponse.messages.length > 1
    )

    return {
      found: true,
      messageTs: handoverMessage.ts,
      hasReplies,
    }
  }

  async scanAndReplyToHandover(): Promise<ScanAndReplyResult> {
    const userToken = await this.getUserToken()
    if (!userToken) {
      return {
        success: false,
        replied: false,
        message: 'No Slack user token configured',
        error: 'SLACK_USER_TOKEN not set',
      }
    }

    const scheduledComments = await this.scheduledCommentRepo.findEnabled()
    const slackComments = scheduledComments.filter(
      (c) => c.comment_type === 'slack'
    )

    if (slackComments.length === 0) {
      return {
        success: true,
        replied: false,
        message: 'No scheduled comments configured',
      }
    }

    const channelId = await this.getChannelId()
    if (!channelId) {
      return {
        success: false,
        replied: false,
        message: 'No Slack channel configured',
        error: 'No channel ID available',
      }
    }

    console.info('[Handover] Scanning for handover message', { channel: channelId })

    const handoverCheck = await this.findHandoverMessage(channelId)

    if (!handoverCheck.found) {
      return {
        success: true,
        replied: false,
        message: 'No handover message found',
      }
    }

    if (handoverCheck.hasReplies) {
      return {
        success: true,
        replied: false,
        message: 'Handover message already has replies',
        handoverMessageTs: handoverCheck.messageTs,
      }
    }

    // Get tickets and prepare message
    const tickets = await this.ticketService.getAll()
    const ticketData = convertTicketsToMessageData(tickets)
    const mentions = await this.settingsService.getMemberMentions()

    const message = formatTicketMessage(ticketData, {
      mentions: mentions || undefined,
      includeFooter: false,
    })

    const replyResult = await postThreadReply(
      message,
      handoverCheck.messageTs!,
      channelId,
      userToken
    )

    if (!replyResult.ok) {
      return {
        success: false,
        replied: false,
        message: 'Failed to post reply',
        error: replyResult.error,
      }
    }

    // Update last posted timestamp for all slack comments
    for (const comment of slackComments) {
      await this.scheduledCommentRepo.updateLastPosted(comment.id)
    }

    console.info('[Handover] Posted handover reply', {
      handoverTs: handoverCheck.messageTs,
      replyTs: replyResult.ts,
      ticketsCount: tickets.length,
    })

    return {
      success: true,
      replied: true,
      message: 'Reply posted successfully',
      handoverMessageTs: handoverCheck.messageTs,
      replyTs: replyResult.ts,
      ticketsCount: tickets.length,
    }
  }
}
