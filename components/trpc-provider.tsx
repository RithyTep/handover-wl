"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";
import type { AppRouter } from "@/lib/trpc/root";
import { generateChallengeHeaders, initChallengeSession } from "@/lib/security/client/challenge-manager";

const clientLogger = {
  error: (message: string, context?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === "development") {
      console.error(`[Security] ${message}`, context ?? "");
    }
  },
};

export const trpc = createTRPCReact<AppRouter>();

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

const PROTECTED_MUTATIONS = [
  "ticketData.save",
  "slack.send",
  "slack.postThread",
  "backup.create",
  "backup.restore",
  "feedback.create",
  "settings.set",
  "scheduler.update",
  "scheduledComments.create",
  "scheduledComments.update",
  "scheduledComments.delete",
  "theme.setSelected",
];

function isProtectedMutation(path: string): boolean {
  return PROTECTED_MUTATIONS.some((m) => path.includes(m));
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [_isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initChallengeSession()
      .then(() => setIsInitialized(true))
      .catch((err) => {
        clientLogger.error("Challenge failed to initialize", { error: err });
        setIsInitialized(true);
      });
  }, []);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
            retryDelay: 1000,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
          maxURLLength: 2083,
          async headers(opts) {
            const op = opts.opList[0];
            if (op && op.type === "mutation" && isProtectedMutation(op.path)) {
              try {
                const challengeHeaders = await generateChallengeHeaders(op.input);
                return challengeHeaders;
              } catch (err) {
                clientLogger.error("Challenge failed to generate headers", { error: err });
                return {};
              }
            }
            return {};
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
