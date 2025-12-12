import { useCallback } from "react"
import { toast } from "sonner"
import confetti from "canvas-confetti"
import { trpc } from "@/components/trpc-provider"
import type { Ticket } from "@/lib/types"

const DEFAULT_VALUE = "--"

interface UseSlackIntegrationOptions {
	tickets: Ticket[]
	ticketData: Record<string, string>
}

export function useSlackIntegration({
	tickets,
	ticketData,
}: UseSlackIntegrationOptions) {
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

	return { handleSendSlack, handleCopyForSlack }
}
