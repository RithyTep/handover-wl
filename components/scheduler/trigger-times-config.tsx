"use client"

import { Clock, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TriggerTimesConfigProps {
	eveningTime: string
	nightTime: string
	onEveningTimeChange: (value: string) => void
	onNightTimeChange: (value: string) => void
	onSave: () => void
	isSaving?: boolean
}

export function TriggerTimesConfig({
	eveningTime,
	nightTime,
	onEveningTimeChange,
	onNightTimeChange,
	onSave,
	isSaving = false,
}: TriggerTimesConfigProps) {
	return (
		<div className="border border-border rounded-lg p-6 bg-card">
			<div className="flex items-center gap-2 mb-4">
				<Clock className="w-4 h-4 text-muted-foreground" />
				<h3 className="text-base font-semibold">Trigger Times</h3>
			</div>

			<p className="text-sm text-muted-foreground mb-4">
				Configure when shift handovers are automatically posted. Times are in Bangkok timezone (GMT+7).
			</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<Label htmlFor="eveningTime" className="text-sm font-medium mb-2 block">
						Evening Shift Time
					</Label>
					<Input
						id="eveningTime"
						type="time"
						value={eveningTime}
						onChange={(e) => onEveningTimeChange(e.target.value)}
						className="w-full font-mono"
					/>
					<p className="text-xs text-muted-foreground mt-1">
						Default: 17:10
					</p>
				</div>

				<div>
					<Label htmlFor="nightTime" className="text-sm font-medium mb-2 block">
						Night Shift Time
					</Label>
					<Input
						id="nightTime"
						type="time"
						value={nightTime}
						onChange={(e) => onNightTimeChange(e.target.value)}
						className="w-full font-mono"
					/>
					<p className="text-xs text-muted-foreground mt-1">
						Default: 22:40
					</p>
				</div>
			</div>

			<Button
				onClick={onSave}
				variant="default"
				size="sm"
				className="w-full sm:w-auto mt-4"
				disabled={isSaving}
			>
				<Save className="w-4 h-4 mr-2" />
				{isSaving ? "Saving..." : "Save Trigger Times"}
			</Button>
		</div>
	)
}
