import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { initDatabase } from "@/server/repository/database.repository";

const t = initTRPC.context<{}>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure.use(async (opts) => {
  await initDatabase();
  return opts.next();
});
