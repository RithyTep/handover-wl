import { trpc } from "@/components/trpc-provider";
import type { Ticket } from "@/interfaces/ticket.interface";

interface UseTicketsOptions {
  initialTickets?: Ticket[];
}

export function useTickets({ initialTickets }: UseTicketsOptions = {}) {
  const { data, isLoading, refetch } = trpc.tickets.getAll.useQuery(undefined, {
    enabled: !initialTickets || initialTickets.length === 0,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const tickets: Ticket[] = data?.tickets || initialTickets || [];

  return {
    tickets,
    isLoading,
    refetch,
  };
}
