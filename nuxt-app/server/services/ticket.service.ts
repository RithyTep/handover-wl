import { TicketRepository } from '../repository/ticket.repository'
import type { TicketData } from '~/types'

export class TicketService {
  private repository: TicketRepository

  constructor() {
    this.repository = new TicketRepository()
  }

  async saveTicketData(tickets: Record<string, { status: string, action: string }>): Promise<void> {
    await this.repository.upsertMany(tickets)
  }

  async loadTicketData(): Promise<Record<string, TicketData>> {
    const rows = await this.repository.findAll()
    const data: Record<string, TicketData> = {}
    for (const row of rows) {
      data[row.ticket_key] = {
        status: row.status,
        action: row.action,
        updated_at: row.updated_at?.toISOString(),
      }
    }
    return data
  }

  async getTicketData(ticketKey: string): Promise<TicketData | null> {
    const row = await this.repository.findByKey(ticketKey)
    if (!row) return null
    return {
      status: row.status,
      action: row.action,
      updated_at: row.updated_at?.toISOString(),
    }
  }

  async deleteTicketData(ticketKey: string): Promise<boolean> {
    return this.repository.delete(ticketKey)
  }
}

// Singleton instance
let ticketServiceInstance: TicketService | null = null

export function getTicketService(): TicketService {
  if (!ticketServiceInstance) {
    ticketServiceInstance = new TicketService()
  }
  return ticketServiceInstance
}
