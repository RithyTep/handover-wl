import { z } from "zod";

export const ticketDataSaveSchema = z.record(
  z.string(),
  z.object({
    status: z.string(),
    action: z.string(),
  })
);
