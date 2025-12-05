import { trpc } from "@/components/trpc-provider";
import type { Ticket } from "@/interfaces/ticket.interface";

interface UseTicketsOptions {
  initialTickets?: Ticket[];
}

export function useTickets({ initialTickets }: UseTicketsOptions = {}) {
  const hasInitialData = initialTickets && initialTickets.length > 0;

  const { data, isLoading: queryLoading, refetch } = trpc.tickets.getAll.useQuery(undefined, {
    enabled: !hasInitialData,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const tickets: Ticket[] = data?.tickets || initialTickets || [];
  // Don't show loading if we have initial data from SSR
  const isLoading = hasInitialData ? false : queryLoading;

  return {
    tickets,
    isLoading,
    refetch,
  };
}
