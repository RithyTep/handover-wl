"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";
import type { AppRouter } from "@/lib/trpc/root";
import { generateChallengeHeaders, initChallengeSession } from "@/lib/security/client/challenge-manager";

export const trpc = createTRPCReact<AppRouter>();

function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

// List of mutation procedure names that require challenge
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

// Check if a procedure path is a protected mutation
function isProtectedMutation(path: string): boolean {
  return PROTECTED_MUTATIONS.some((m) => path.includes(m));
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize challenge session on mount
  useEffect(() => {
    initChallengeSession()
      .then(() => setIsInitialized(true))
      .catch((err) => {
        console.error("[Challenge] Failed to initialize:", err);
        // Still allow the app to work, mutations will fail with proper error
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
            // Check if this is a mutation that needs challenge
            const op = opts.opList[0];
            if (op && op.type === "mutation" && isProtectedMutation(op.path)) {
              try {
                // Generate challenge headers with the request input
                const challengeHeaders = await generateChallengeHeaders(op.input);
                return challengeHeaders;
              } catch (err) {
                console.error("[Challenge] Failed to generate headers:", err);
                // Return empty headers, server will reject with proper error
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
