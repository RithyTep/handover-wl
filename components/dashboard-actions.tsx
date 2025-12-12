"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getActionsConfig } from "@/lib/theme"
import type { Theme } from "@/lib/types"

// ============================================================================
// Types
// ============================================================================

interface DashboardActionsProps {
	theme: Theme
	onAIFillAll: () => void
	onQuickFill: (status: string, action: string) => void
	onClear: () => void
	onRefresh: () => void
	onCopy: () => void
	onSave: () => void
	onSendSlack: () => void
}

interface SvgIconProps {
	src: string
	className?: string
}

// ============================================================================
// Helper Components
// ============================================================================

const SvgIcon = ({ src, className }: SvgIconProps) => (
	<Image src={src} alt="" width={16} height={16} className={cn("w-4 h-4", className)} aria-hidden="true" />
)

// ============================================================================
// Action Button Component
// ============================================================================

interface ActionButtonProps {
	config: {
		id: string
		label: string
		svgIcon?: string
		icon?: React.ComponentType<{ className?: string }>
		className: string
		iconClassName?: string
	}
	onClick: () => void
	variant?: "ghost" | "outline" | "default"
	showDividerAfter?: boolean
	theme: Theme
}

const ActionButton = ({
	config,
	onClick,
	variant = "ghost",
	showDividerAfter = false,
	theme,
}: ActionButtonProps) => {
	const IconComponent = config.icon

	return (
		<>
			<Button
				variant={variant}
				size="sm"
				onClick={onClick}
				className={config.className}
				aria-label={config.label}
			>
				{config.svgIcon && (
					<SvgIcon src={config.svgIcon} className={cn("mr-1.5", config.iconClassName)} />
				)}
				{IconComponent && (
					<IconComponent className={cn("w-3.5 h-3.5 mr-1.5", config.iconClassName)} />
				)}
				<span>{config.label}</span>
			</Button>
			{showDividerAfter && (
				<div
					className={cn(
						"h-6 mx-1",
						theme === "coding" ? "w-px bg-zinc-700" : "w-0.5 bg-slate-800"
					)}
					aria-hidden="true"
				/>
			)}
		</>
	)
}

// ============================================================================
// Main Component
// ============================================================================

export const DashboardActions = ({
	theme,
	onAIFillAll,
	onQuickFill,
	onClear,
	onRefresh,
	onCopy,
	onSave,
	onSendSlack,
}: DashboardActionsProps) => {
	const actionsConfig = getActionsConfig(theme)

	const handleQuickFill = () => {
		onQuickFill("Pending", "Will check tomorrow")
	}

	const actions = [
		{ config: actionsConfig.aiFill, onClick: onAIFillAll },
		{ config: actionsConfig.quickFill, onClick: handleQuickFill },
		{ config: actionsConfig.clear, onClick: onClear },
		{ config: actionsConfig.refresh, onClick: onRefresh, showDividerAfter: theme === "pixel" || theme === "coding" },
		{ config: actionsConfig.copy, onClick: onCopy },
		{ config: actionsConfig.save, onClick: onSave, variant: theme === "default" ? "outline" as const : "ghost" as const },
		{ config: actionsConfig.send, onClick: onSendSlack, variant: theme === "default" || theme === "christmas" ? "default" as const : "ghost" as const },
	]

	return (
		<div
			className={cn(
				"hidden sm:flex items-center pt-2",
				theme === "default" ? "gap-2" : "gap-3"
			)}
			role="toolbar"
			aria-label="Dashboard actions"
		>
			{actions.map(({ config, onClick, variant = "ghost", showDividerAfter = false }) => (
				<ActionButton
					key={config.id}
					config={config}
					onClick={onClick}
					variant={variant}
					showDividerAfter={showDividerAfter}
					theme={theme}
				/>
			))}
		</div>
	)
}
