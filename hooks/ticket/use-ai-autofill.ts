import { useCallback } from "react"
import { toast } from "sonner"
import confetti from "canvas-confetti"
import { trpc } from "@/components/trpc-provider"
import type { Ticket } from "@/lib/types"

const BATCH_SIZE = 3
const DEFAULT_VALUE = "--"

interface TicketUpdate {
	ticketKey: string
	status?: string
	action?: string
}

interface UseAIAutofillOptions {
	tickets: Ticket[]
	ticketData: Record<string, string>
	setTicketData: React.Dispatch<React.SetStateAction<Record<string, string>>>
	setRenderKey: React.Dispatch<React.SetStateAction<number>>
}

export function useAIAutofill({
	tickets,
	ticketData,
	setTicketData,
	setRenderKey,
}: UseAIAutofillOptions) {
	const aiAutofillMutation = trpc.ai.autofill.useMutation()

	const handleAIFillAll = useCallback(async () => {
		const missingTickets = tickets.filter((ticket) => {
			const status = ticketData[`status-${ticket.key}`]
			const action = ticketData[`action-${ticket.key}`]
			return !status || status === DEFAULT_VALUE || !action || action === DEFAULT_VALUE
		})

		if (missingTickets.length === 0) {
			toast.info("All tickets already have status and action filled")
			return
		}

		const loadingToast = toast.loading(`AI filling ${missingTickets.length} ticket(s)...`)

		try {
			const newData = { ...ticketData }
			const updates: TicketUpdate[] = []
			let successCount = 0
			let errorCount = 0

			for (let i = 0; i < missingTickets.length; i += BATCH_SIZE) {
				const batch = missingTickets.slice(i, i + BATCH_SIZE)
				const batchEnd = Math.min(i + BATCH_SIZE, missingTickets.length)

				toast.loading(`AI filling ${i + 1}-${batchEnd} of ${missingTickets.length}...`, {
					id: loadingToast,
				})

				const batchResults = await Promise.allSettled(
					batch.map(async (ticket) => {
						const result = await aiAutofillMutation.mutateAsync({
							ticket: {
								...ticket,
								dueDate: ticket.dueDate ?? undefined,
							},
						})
						return { ticket, suggestion: result.suggestion }
					})
				)

				batchResults.forEach((result) => {
					if (result.status === "fulfilled") {
						const { ticket, suggestion } = result.value
						const currentStatus = ticketData[`status-${ticket.key}`]
						const currentAction = ticketData[`action-${ticket.key}`]

						const update: TicketUpdate = { ticketKey: ticket.key }

						if (!currentStatus || currentStatus === DEFAULT_VALUE) {
							newData[`status-${ticket.key}`] = suggestion.status
							update.status = suggestion.status
						}
						if (!currentAction || currentAction === DEFAULT_VALUE) {
							newData[`action-${ticket.key}`] = suggestion.action
							update.action = suggestion.action
						}

						updates.push(update)
						successCount++
					} else {
						errorCount++
					}
				})
			}

			setTicketData(newData)
			setRenderKey((prev) => prev + 1)

			toast.dismiss(loadingToast)

			if (errorCount === 0) {
				confetti({
					particleCount: 100,
					spread: 70,
					origin: { y: 0.6 },
				})
				toast.success(`Successfully AI-filled ${successCount} ticket(s)`)
			} else {
				toast.warning(`Filled ${successCount} ticket(s), ${errorCount} failed`)
			}
		} catch (error) {
			toast.dismiss(loadingToast)
			const message = error instanceof Error ? error.message : "Unknown error"
			toast.error(`Error during AI fill: ${message}`)
		}
	}, [tickets, ticketData, aiAutofillMutation, setTicketData, setRenderKey])

	return { handleAIFillAll }
}
