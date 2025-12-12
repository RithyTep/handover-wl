"use client"

import { Clock, CheckCircle2, XCircle, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SchedulerStatusProps {
	enabled: boolean
	loading: boolean
	onToggle: () => void
}

export function SchedulerStatus({ enabled, loading, onToggle }: SchedulerStatusProps) {
	return (
		<div className="border border-border rounded-lg p-6 bg-card">
			<div className="flex items-start justify-between mb-6">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
						<Clock className="w-5 h-5 text-foreground" />
					</div>
					<div>
						<h3 className="text-base font-semibold mb-1">Auto-send Status</h3>
						<Badge variant={enabled ? "default" : "secondary"} className="text-xs">
							{enabled ? (
								<>
									<CheckCircle2 className="w-3 h-3 mr-1" />
									Enabled
								</>
							) : (
								<>
									<XCircle className="w-3 h-3 mr-1" />
									Disabled
								</>
							)}
						</Badge>
					</div>
				</div>
				<Button
					onClick={onToggle}
					variant={enabled ? "destructive" : "default"}
					size="sm"
					disabled={loading}
				>
					{enabled ? "Disable" : "Enable"}
				</Button>
			</div>

			{enabled && (
				<div className="p-3 bg-muted/50 rounded-md border border-border/50">
					<div className="flex items-start gap-2">
						<Bell className="w-4 h-4 text-muted-foreground mt-0.5" />
						<div>
							<p className="text-sm font-medium mb-1">Active</p>
							<p className="text-xs text-muted-foreground">
								Reports will be sent based on shift configuration. Only shifts with valid user tokens will trigger.
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
