"use client"

import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ManualTriggerProps {
	triggering: boolean
	onTrigger: () => void
}

export function ManualTrigger({ triggering, onTrigger }: ManualTriggerProps) {
	return (
		<div className="border border-border rounded-lg p-6 bg-card">
			<h3 className="text-base font-semibold mb-2">Manual Trigger</h3>
			<p className="text-sm text-muted-foreground mb-4">
				Manually scan and reply to handover messages.
			</p>
			<Button
				onClick={onTrigger}
				disabled={triggering}
				variant="outline"
				className="w-full"
			>
				<Zap className="w-4 h-4 mr-2" />
				{triggering ? "Posting..." : "Trigger Scheduled Comments"}
			</Button>
		</div>
	)
}
