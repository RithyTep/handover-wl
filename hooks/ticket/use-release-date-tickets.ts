import { trpc } from "@/components/trpc-provider"
import type { Ticket } from "@/lib/types"

interface UseReleaseDateTicketsOptions {
	enabled?: boolean
}

interface UseReleaseDateTicketsReturn {
	tickets: Ticket[]
	isLoading: boolean
	refetch: () => void
}

export const useReleaseDateTickets = (
	{ enabled = true }: UseReleaseDateTicketsOptions = {}
): UseReleaseDateTicketsReturn => {
	const { data, isLoading, refetch } = trpc.tickets.getReleaseDateTickets.useQuery(undefined, {
		enabled,
		staleTime: 30000,
		gcTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
		retry: 1,
	})

	return {
		tickets: data?.tickets ?? [],
		isLoading,
		refetch,
	}
}
