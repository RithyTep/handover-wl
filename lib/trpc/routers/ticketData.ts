import { z } from "zod";
import { router, publicProcedure } from "@/server/trpc/server";
import { TicketService } from "@/server/services/ticket.service";

const ticketService = new TicketService();

export const ticketDataRouter = router({
  save: publicProcedure
    .input(z.record(z.string(), z.string()))
    .mutation(async ({ input }) => {
      const formattedData: Record<string, { status: string; action: string }> = {};

      for (const [key, value] of Object.entries(input)) {
        const isStatus = key.startsWith("status-");
        const isAction = key.startsWith("action-");

        if (!isStatus && !isAction) continue;

        const ticketKey = key.replace(/^(status|action)-/, "");
        if (!formattedData[ticketKey]) {
          formattedData[ticketKey] = { status: "--", action: "--" };
        }

        if (isStatus) formattedData[ticketKey].status = value;
        if (isAction) formattedData[ticketKey].action = value;
      }

      await ticketService.saveTicketData(formattedData);
      return { success: true, ticketCount: Object.keys(formattedData).length };
    }),
});
