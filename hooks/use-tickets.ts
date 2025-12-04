import { trpc } from "@/components/trpc-provider";
import type { Ticket } from "@/app/columns";

interface UseTicketsOptions {
  initialTickets?: Ticket[];
}

export function useTickets({ initialTickets }: UseTicketsOptions = {}) {
  const { data, isLoading, refetch } = trpc.tickets.getAll.useQuery(undefined, {
    enabled: !initialTickets || initialTickets.length === 0,
  });

  const tickets: Ticket[] = data?.tickets || initialTickets || [];

  return {
    tickets,
    isLoading,
    refetch,
  };
}
