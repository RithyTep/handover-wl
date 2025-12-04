import { router, publicProcedure } from "@/server/trpc/server";
import { TicketService } from "@/server/services/ticket.service";
import { getTicketsWithSavedData } from "@/lib/services/jira";

const ticketService = new TicketService();

export const ticketsRouter = router({
  getAll: publicProcedure.query(async () => {
    const savedData = await ticketService.loadTicketData();
    const tickets = await getTicketsWithSavedData(savedData);

    return {
      success: true,
      tickets,
      total: tickets.length,
      storage: "postgresql",
    };
  }),
});
