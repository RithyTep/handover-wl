import { useState, useCallback, useEffect, useRef } from "react"
import { toast } from "sonner"
import confetti from "canvas-confetti"
import { trpc } from "@/components/trpc-provider"
import type { Ticket } from "@/lib/types"
import { useAIAutofill } from "./use-ai-autofill"
import { useSlackIntegration } from "./use-slack-integration"

interface UseTicketActionsProps {
	tickets: Ticket[]
}

interface UseTicketActionsReturn {
	ticketData: Record<string, string>
	updateTicketData: (key: string, value: string) => void
	renderKey: number
	handleSave: () => Promise<void>
	handleSendSlack: () => Promise<void>
	handleAIFillAll: () => Promise<void>
	handleCopyForSlack: () => Promise<void>
	handleQuickFill: (status: string, action: string) => void
	handleClear: () => void
}

const DEFAULT_VALUE = "--"

export const useTicketActions = ({ tickets }: UseTicketActionsProps): UseTicketActionsReturn => {
	const [ticketData, setTicketData] = useState<Record<string, string>>({})
	const [renderKey, setRenderKey] = useState(0)
	const initializedRef = useRef(false)

	const saveMutation = trpc.ticketData.save.useMutation({
		onSuccess: () => {
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
			})
			toast.success("Your changes have been saved")
		},
		onError: (error) => {
			toast.error(`Error saving: ${error.message}`)
		},
	})

	const { handleAIFillAll } = useAIAutofill({
		tickets,
		ticketData,
		setTicketData,
		setRenderKey,
	})

	const { handleSendSlack, handleCopyForSlack } = useSlackIntegration({
		tickets,
		ticketData,
	})

	useEffect(() => {
		if (tickets.length === 0 || initializedRef.current) return

		const initialData: Record<string, string> = {}
		tickets.forEach((ticket) => {
			if (ticket.savedStatus && ticket.savedStatus !== DEFAULT_VALUE) {
				initialData[`status-${ticket.key}`] = ticket.savedStatus
			}
			if (ticket.savedAction && ticket.savedAction !== DEFAULT_VALUE) {
				initialData[`action-${ticket.key}`] = ticket.savedAction
			}
		})

		if (Object.keys(initialData).length > 0) {
			setTicketData(initialData)
			setRenderKey((prev) => prev + 1)
		}
		initializedRef.current = true
	}, [tickets])

	const updateTicketData = useCallback((key: string, value: string) => {
		setTicketData((prev) => ({ ...prev, [key]: value }))
	}, [])

	const handleSave = useCallback(async () => {
		const loadingToast = toast.loading("Saving...")
		try {
			await saveMutation.mutateAsync(ticketData)
		} finally {
			toast.dismiss(loadingToast)
		}
	}, [ticketData, saveMutation])

	const handleQuickFill = useCallback(
		(status: string, action: string) => {
			const newData = { ...ticketData }
			tickets.forEach((ticket) => {
				newData[`status-${ticket.key}`] = status
				newData[`action-${ticket.key}`] = action
			})
			setTicketData(newData)
			setRenderKey((prev) => prev + 1)
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
			})
			toast.success("All tickets have been filled")
		},
		[ticketData, tickets]
	)

	const handleClear = useCallback(() => {
		const newData: Record<string, string> = {}
		Object.keys(ticketData).forEach((key) => {
			newData[key] = DEFAULT_VALUE
		})
		setTicketData(newData)
		setRenderKey((prev) => prev + 1)
		toast.success("All fields have been cleared")
	}, [ticketData])

	return {
		ticketData,
		updateTicketData,
		renderKey,
		handleSave,
		handleSendSlack,
		handleAIFillAll,
		handleCopyForSlack,
		handleQuickFill,
		handleClear,
	}
}
