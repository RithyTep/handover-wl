"use client"

import { useState, useCallback, useEffect } from "react"
import { DashboardLayout } from "./dashboard-layout"
import { useTickets } from "@/hooks/ticket/use-tickets"
import { useReleaseDateTickets } from "@/hooks/ticket/use-release-date-tickets"
import { useTicketActions } from "@/hooks/ticket/use-ticket-actions"
import { useThemeStore } from "@/lib/stores/theme-store"
import { DEFAULT_THEME } from "@/lib/constants"
import type { Theme, Ticket, DashboardTab } from "@/lib/types"

interface DashboardClientProps {
	initialTickets?: Ticket[]
	initialTheme?: Theme
}

export function DashboardClient({
	initialTickets,
	initialTheme,
}: DashboardClientProps) {
	const [activeTab, setActiveTab] = useState<DashboardTab>("pending")

	const { tickets: pendingTickets, refetch: refetchPending } = useTickets({ initialTickets })
	const {
		tickets: releaseDateTickets,
		refetch: refetchReleaseDate,
	} = useReleaseDateTickets({ enabled: activeTab === "release-date" })

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

	const tickets = activeTab === "pending" ? pendingTickets : releaseDateTickets
	const handleRefresh = activeTab === "pending" ? () => refetchPending() : () => refetchReleaseDate()

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
	} = useTicketActions({ tickets: pendingTickets })

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
			activeTab={activeTab}
			onTabChange={setActiveTab}
			pendingCount={pendingTickets.length}
			releaseDateCount={releaseDateTickets.length}
			onAIFillAll={handleAIFillAll}
			onQuickFill={handleQuickFill}
			onClear={handleClear}
			onRefresh={handleRefresh}
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
