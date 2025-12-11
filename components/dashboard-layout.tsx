"use client"

import { useEffect, useMemo } from "react"
import { NewYearScene } from "@/components/new-year-scene"
import { LunarScene } from "@/components/lunar-scene"
import { CodingScene } from "@/components/coding-scene"
import { ProfessionalScene } from "@/components/professional-scene"
import { AngkorPixelScene } from "@/components/angkor-pixel-scene"
import { DashboardHeader } from "./dashboard-header"
import { DashboardContent } from "./dashboard-content"
import { DashboardMobileActions } from "./dashboard-mobile-actions"
import { CommandPalette } from "@/components/command-palette"
import { QuickFillDialog } from "./quick-fill-dialog"
import { ClearDialog } from "./clear-dialog"
import { SendSlackDialog } from "./send-slack-dialog"
import { PixelStatusBar } from "@/components/pixel-status-bar"
import { CodingFooter } from "@/components/coding-footer"
import { cn } from "@/lib/utils"
import { getLayoutConfig } from "@/lib/theme"
import type { Theme, Ticket } from "@/lib/types"

// ============================================================================
// Types
// ============================================================================

interface DashboardLayoutProps {
	theme: Theme
	tickets: Ticket[]
	ticketData: Record<string, string>
	updateTicketData: (key: string, value: string) => void
	renderKey: number
	onAIFillAll: () => void
	onQuickFill: (status: string, action: string) => void
	onClear: () => void
	onRefresh: () => void
	onCopy: () => void
	onSave: () => void
	onSendSlack: () => Promise<void>
	quickFillOpen: boolean
	onQuickFillOpenChange: (open: boolean) => void
	clearOpen: boolean
	onClearOpenChange: (open: boolean) => void
	sendSlackOpen: boolean
	onSendSlackOpenChange: (open: boolean) => void
}

// ============================================================================
// Scene Components Mapping
// ============================================================================

const THEME_SCENES: Record<Theme, React.ComponentType | null> = {
	default: ProfessionalScene,
	christmas: NewYearScene,
	pixel: PixelStatusBar,
	lunar: LunarScene,
	coding: CodingScene,
	clash: null,
	angkor_pixel: AngkorPixelScene,
}

// ============================================================================
// Main Component
// ============================================================================

export const DashboardLayout = ({
	theme,
	tickets,
	ticketData,
	updateTicketData,
	renderKey,
	onAIFillAll,
	onQuickFill,
	onClear,
	onRefresh,
	onCopy,
	onSave,
	onSendSlack,
	quickFillOpen,
	onQuickFillOpenChange,
	clearOpen,
	onClearOpenChange,
	sendSlackOpen,
	onSendSlackOpenChange,
}: DashboardLayoutProps) => {
	const layoutConfig = useMemo(() => getLayoutConfig(theme), [theme])

	// Apply body theme class
	useEffect(() => {
		document.body.classList.remove(
			"theme-christmas",
			"theme-default",
			"theme-pixel",
			"theme-lunar",
			"theme-coding",
			"theme-clash",
			"theme-angkor_pixel"
		)
		document.body.classList.add(`theme-${theme}`)
	}, [theme])

	const SceneComponent = THEME_SCENES[theme]

	const handleOpenQuickFill = () => onQuickFillOpenChange(true)
	const handleOpenClear = () => onClearOpenChange(true)
	const handleOpenSendSlack = () => onSendSlackOpenChange(true)

	return (
		<>
			<CommandPalette
				onAIFillAll={onAIFillAll}
				onQuickFill={handleOpenQuickFill}
				onClear={handleOpenClear}
				onSave={onSave}
				onSendSlack={handleOpenSendSlack}
				onCopy={onCopy}
				onRefresh={onRefresh}
			/>
			<div
				className={cn("h-dvh flex flex-col overflow-hidden relative", layoutConfig.background)}
				role="main"
			>
				{SceneComponent && <SceneComponent />}
				<DashboardHeader theme={theme} ticketCount={tickets.length} />
				<DashboardContent
					tickets={tickets}
					ticketData={ticketData}
					updateTicketData={updateTicketData}
					renderKey={renderKey}
					theme={theme}
					onAIFillAll={onAIFillAll}
					onQuickFill={handleOpenQuickFill}
					onClear={handleOpenClear}
					onRefresh={onRefresh}
					onCopy={onCopy}
					onSave={onSave}
					onSendSlack={handleOpenSendSlack}
				/>
				<DashboardMobileActions
					theme={theme}
					onAIFillAll={onAIFillAll}
					onQuickFill={handleOpenQuickFill}
					onClear={handleOpenClear}
					onSave={onSave}
					onSendSlack={handleOpenSendSlack}
				/>
				{theme === "coding" && <CodingFooter />}
			</div>
			<QuickFillDialog
				open={quickFillOpen}
				onOpenChange={onQuickFillOpenChange}
				onQuickFill={onQuickFill}
			/>
			<ClearDialog
				open={clearOpen}
				onOpenChange={onClearOpenChange}
				onClearAll={onClear}
			/>
			<SendSlackDialog
				open={sendSlackOpen}
				onOpenChange={onSendSlackOpenChange}
				onSendSlack={onSendSlack}
			/>
		</>
	)
}
