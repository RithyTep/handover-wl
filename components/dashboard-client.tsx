"use client"

import { useState, useCallback, useEffect } from "react"
import { DashboardLayout } from "./dashboard-layout"
import { useTickets } from "@/hooks/ticket/use-tickets"
import { useTicketActions } from "@/hooks/ticket/use-ticket-actions"
import { useThemeStore } from "@/lib/stores/theme-store"
import { DEFAULT_THEME } from "@/lib/constants"
import type { Theme, Ticket } from "@/lib/types"

interface DashboardClientProps {
	initialTickets?: Ticket[]
	initialTheme?: Theme
}

export function DashboardClient({
	initialTickets,
	initialTheme,
}: DashboardClientProps) {
	const { tickets, refetch } = useTickets({ initialTickets })
	const selectedTheme = useThemeStore((state) => state.selectedTheme)
	const setTheme = useThemeStore((state) => state.setTheme)
	const loadFromLocalStorage = useThemeStore(
		(state) => state.loadFromLocalStorage
	)

	const theme: Theme = selectedTheme ?? initialTheme ?? DEFAULT_THEME

	useEffect(() => {
		if (initialTheme && !selectedTheme) {
			setTheme(initialTheme)
		}
		loadFromLocalStorage()
	}, [initialTheme, selectedTheme, setTheme, loadFromLocalStorage])

	const {
		ticketData,
		updateTicketData,
		renderKey,
		handleSave,
		handleSendSlack,
		handleAIFillAll,
		handleCopyForSlack,
		handleQuickFill: handleQuickFillAction,
		handleClear: handleClearAction,
	} = useTicketActions({ tickets })

	const [quickFillOpen, setQuickFillOpen] = useState(false)
	const [clearOpen, setClearOpen] = useState(false)
	const [sendSlackOpen, setSendSlackOpen] = useState(false)

	const handleQuickFill = useCallback(
		(status: string, action: string) => {
			handleQuickFillAction(status, action)
			setQuickFillOpen(false)
		},
		[handleQuickFillAction]
	)

	const handleClear = useCallback(() => {
		handleClearAction()
		setClearOpen(false)
	}, [handleClearAction])

	return (
		<DashboardLayout
			theme={theme}
			tickets={tickets}
			ticketData={ticketData}
			updateTicketData={updateTicketData}
			renderKey={renderKey}
			onAIFillAll={handleAIFillAll}
			onQuickFill={handleQuickFill}
			onClear={handleClear}
			onRefresh={() => refetch()}
			onCopy={handleCopyForSlack}
			onSave={handleSave}
			onSendSlack={handleSendSlack}
			quickFillOpen={quickFillOpen}
			onQuickFillOpenChange={setQuickFillOpen}
			clearOpen={clearOpen}
			onClearOpenChange={setClearOpen}
			sendSlackOpen={sendSlackOpen}
			onSendSlackOpenChange={setSendSlackOpen}
		/>
	)
}
