import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { initDatabase } from "@/server/repository/database.repository";
import { validateChallenge, createChallengeErrorResponse } from "@/lib/security/challenge.service";

// Context type that includes headers for challenge validation
interface TRPCContext {
  headers?: Headers;
}

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;

// Public procedure - no challenge required (for reads)
export const publicProcedure = t.procedure.use(async (opts) => {
  await initDatabase();
  return opts.next();
});

// Protected mutation procedure - requires browser challenge
export const protectedMutation = t.procedure.use(async (opts) => {
  await initDatabase();
  return opts.next();
}).use(async (opts) => {
  const { ctx } = opts;

  // Skip challenge validation if no headers (SSR context)
  if (!ctx.headers) {
    return opts.next();
  }

  // Validate challenge
  const result = await validateChallenge(ctx.headers);

  if (!result.valid) {
    const errorResponse = createChallengeErrorResponse(result.error || "Challenge validation failed");
    throw new TRPCError({
      code: "FORBIDDEN",
      message: errorResponse.message,
      cause: errorResponse.data,
    });
  }

  return opts.next({
    ctx: {
      ...ctx,
      sessionId: result.sessionId,
    },
  });
});
