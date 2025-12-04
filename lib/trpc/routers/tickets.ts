import { router, publicProcedure } from "../server";
import { loadTicketData, getTicketsWithSavedData } from "@/lib/services";

export const ticketsRouter = router({
  getAll: publicProcedure.query(async () => {
    const savedData = await loadTicketData();
    const tickets = await getTicketsWithSavedData(savedData);

    return {
      success: true,
      tickets,
      total: tickets.length,
      storage: "postgresql",
    };
  }),
});
