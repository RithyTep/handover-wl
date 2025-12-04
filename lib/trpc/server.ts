import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { initDatabase } from "@/lib/services/database";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<{}>().create({
  transformer: superjson,
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure.use(async (opts) => {
  // Initialize database before each procedure
  await initDatabase();
  return opts.next();
});
