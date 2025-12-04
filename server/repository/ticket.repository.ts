import { withClient, withTransaction } from "./database.repository";
import type { TicketData } from "@/interfaces/ticket.interface";

export class TicketRepository {
  async saveTicketData(tickets: Record<string, { status: string; action: string }>): Promise<void> {
    await withTransaction(async (client) => {
      for (const [ticketKey, data] of Object.entries(tickets)) {
        await client.query(
          `INSERT INTO ticket_data (ticket_key, status, action, updated_at)
           VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
           ON CONFLICT (ticket_key)
           DO UPDATE SET status = EXCLUDED.status, action = EXCLUDED.action, updated_at = CURRENT_TIMESTAMP`,
          [ticketKey, data.status, data.action]
        );
      }
    });
  }

  async loadTicketData(): Promise<Record<string, TicketData>> {
    return withClient(async (client) => {
      const result = await client.query("SELECT ticket_key, status, action, updated_at FROM ticket_data");
      const data: Record<string, TicketData> = {};
      for (const row of result.rows) {
        data[row.ticket_key] = {
          status: row.status,
          action: row.action,
          updated_at: row.updated_at?.toISOString(),
        };
      }
      return data;
    }, {});
  }
}
