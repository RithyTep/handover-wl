import { useState, useCallback, useEffect, useRef } from "react"
import { toast } from "sonner"
import confetti from "canvas-confetti"
import { trpc } from "@/components/trpc-provider"
import type { Ticket } from "@/lib/types"

// ============================================================================
// Types
// ============================================================================

interface UseTicketActionsProps {
	tickets: Ticket[]
}

interface TicketUpdate {
	ticketKey: string
	status?: string
	action?: string
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

// ============================================================================
// Constants
// ============================================================================

const BATCH_SIZE = 3
const DEFAULT_VALUE = "--"

// ============================================================================
// Hook
// ============================================================================

export const useTicketActions = ({ tickets }: UseTicketActionsProps): UseTicketActionsReturn => {
	const [ticketData, setTicketData] = useState<Record<string, string>>({})
	const [renderKey, setRenderKey] = useState(0)
	const initializedRef = useRef(false)

	// Mutations
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

	const sendSlackMutation = trpc.slack.send.useMutation({
		onSuccess: () => {
			confetti({
				particleCount: 200,
				spread: 100,
				origin: { y: 0.5 },
				colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"],
			})
			toast.success("Successfully sent to Slack")
		},
		onError: (error) => {
			toast.error(`Error: ${error.message}`)
		},
	})

	const aiAutofillMutation = trpc.ai.autofill.useMutation()

	// Initialize ticketData with saved values from tickets on mount
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

	const handleSendSlack = useCallback(async () => {
		const loadingToast = toast.loading("Sending to Slack...")
		try {
			const ticketDetails: Record<string, Record<string, unknown>> = {}
			tickets.forEach((ticket) => {
				ticketDetails[ticket.key] = {
					summary: ticket.summary,
					status: ticket.status,
					assignee: ticket.assignee,
					created: ticket.created,
					dueDate: ticket.dueDate ?? undefined,
					wlMainTicketType: ticket.wlMainTicketType,
					wlSubTicketType: ticket.wlSubTicketType,
					customerLevel: ticket.customerLevel,
				}
			})
			await sendSlackMutation.mutateAsync({
				ticketData,
				ticketDetails,
			})
		} finally {
			toast.dismiss(loadingToast)
		}
	}, [ticketData, tickets, sendSlackMutation])

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
	}, [tickets, ticketData, aiAutofillMutation])

	const handleCopyForSlack = useCallback(async () => {
		const JIRA_URL = process.env.NEXT_PUBLIC_JIRA_URL || process.env.JIRA_URL || "https://olympian.atlassian.net"
		if (!JIRA_URL) {
			toast.error("JIRA_URL not configured")
			return
		}

		const ticketKeys = Object.keys(ticketData)
			.filter((key) => key.startsWith("status-"))
			.map((key) => key.replace("status-", ""))

		const filledTickets = ticketKeys.filter((ticketKey) => {
			const status = ticketData[`status-${ticketKey}`]
			const action = ticketData[`action-${ticketKey}`]
			return status !== DEFAULT_VALUE || action !== DEFAULT_VALUE
		})

		if (filledTickets.length === 0) {
			toast.error("No tickets with filled status or action")
			return
		}

		const messages = filledTickets.map((ticketKey, index) => {
			const status = ticketData[`status-${ticketKey}`]
			const action = ticketData[`action-${ticketKey}`]
			const ticket = tickets.find((t) => t.key === ticketKey)
			if (!ticket) return ""

			const ticketUrl = `${JIRA_URL}/browse/${ticketKey}`

			return [
				`--- Ticket ${index + 1} ---`,
				`Ticket Link: <${ticketUrl}> ${ticket.summary}`,
				`WL Main Type: ${ticket.wlMainTicketType}`,
				`WL Sub Type: ${ticket.wlSubTicketType}`,
				`Status: ${status}`,
				`Action: ${action}`,
				"",
			].join("\n")
		})

		await navigator.clipboard.writeText(messages.join("").trim())
		toast.success(`Copied ${filledTickets.length} ticket(s) to clipboard`)
	}, [ticketData, tickets])

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
