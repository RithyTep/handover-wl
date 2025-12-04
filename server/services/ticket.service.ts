import { TicketRepository } from "@/server/repository/ticket.repository";
import type { TicketData } from "@/interfaces/ticket.interface";

export class TicketService {
  private repository: TicketRepository;

  constructor() {
    this.repository = new TicketRepository();
  }

  async saveTicketData(tickets: Record<string, { status: string; action: string }>): Promise<void> {
    await this.repository.saveTicketData(tickets);
  }

  async loadTicketData(): Promise<Record<string, TicketData>> {
    return this.repository.loadTicketData();
  }
}
