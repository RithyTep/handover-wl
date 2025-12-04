import { router, publicProcedure } from "@/server/trpc/server";
import { TicketService } from "@/server/services/ticket.service";
import { getTicketsWithSavedData } from "@/lib/services/jira";

const ticketService = new TicketService();

let ticketsCache: { tickets: Awaited<ReturnType<typeof getTicketsWithSavedData>>; timestamp: number } | null = null;
const TICKETS_CACHE_TTL = 30000;

export const ticketsRouter = router({
  getAll: publicProcedure.query(async () => {
    const now = Date.now();
    if (ticketsCache && now - ticketsCache.timestamp < TICKETS_CACHE_TTL) {
      return {
        success: true,
        tickets: ticketsCache.tickets,
        total: ticketsCache.tickets.length,
        storage: "postgresql",
      };
    }

    const savedData = await ticketService.loadTicketData();
    const tickets = await getTicketsWithSavedData(savedData);
    ticketsCache = { tickets, timestamp: now };

    return {
      success: true,
      tickets,
      total: tickets.length,
      storage: "postgresql",
    };
  }),
});
