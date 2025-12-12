import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { initDatabase } from "@/server/repository/database.repository";
import { validateChallenge, createChallengeErrorResponse } from "@/lib/security/challenge.service";
import { HEADERS } from "@/lib/security/constants";

interface TRPCContext {
  headers?: Headers;
}

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;

export const publicProcedure = t.procedure.use(async (opts) => {
  await initDatabase();
  return opts.next();
});

export const protectedMutation = t.procedure.use(async (opts) => {
  await initDatabase();
  return opts.next();
}).use(async (opts) => {
  const { ctx } = opts;

  if (!ctx.headers) {
    return opts.next();
  }

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
