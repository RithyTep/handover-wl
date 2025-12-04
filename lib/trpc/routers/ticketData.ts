import { z } from "zod";
import { router, publicProcedure } from "../server";
import { saveTicketData } from "@/lib/services";

export const ticketDataRouter = router({
  save: publicProcedure
    .input(
      z.record(z.string(), z.string()) // Record<string, string> for ticketData
    )
    .mutation(async ({ input }) => {
      // Format the data like the original API route does
      const formattedData: Record<string, { status: string; action: string }> = {};

      for (const [key, value] of Object.entries(input)) {
        const isStatus = key.startsWith("status-");
        const isAction = key.startsWith("action-");

        if (!isStatus && !isAction) continue;

        const ticketKey = key.replace(/^(status|action)-/, "");
        if (!formattedData[ticketKey]) {
          formattedData[ticketKey] = { status: "--", action: "--" };
        }

        if (isStatus) formattedData[ticketKey].status = value as string;
        if (isAction) formattedData[ticketKey].action = value as string;
      }

      await saveTicketData(formattedData);
      return { success: true, ticketCount: Object.keys(formattedData).length };
    }),
});
