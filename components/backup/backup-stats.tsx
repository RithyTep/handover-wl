"use client"

import { HardDrive, Clock, FileText, Settings } from "lucide-react"

interface BackupStatsProps {
	total: number
	auto: number
	manual: number
	latest: string
}

export function BackupStats({ total, auto, manual, latest }: BackupStatsProps) {
	return (
		<div className="px-6 py-4 grid grid-cols-4 gap-4">
			<div className="rounded-lg border bg-card p-4">
				<div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
					<HardDrive className="h-4 w-4" />
					<span>Total Backups</span>
				</div>
				<p className="text-2xl font-semibold">{total}</p>
			</div>

			<div className="rounded-lg border bg-card p-4">
				<div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
					<Clock className="h-4 w-4" />
					<span>Auto Backups</span>
				</div>
				<p className="text-2xl font-semibold">{auto}</p>
			</div>

			<div className="rounded-lg border bg-card p-4">
				<div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
					<FileText className="h-4 w-4" />
					<span>Manual Backups</span>
				</div>
				<p className="text-2xl font-semibold">{manual}</p>
			</div>

			<div className="rounded-lg border bg-card p-4">
				<div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
					<Settings className="h-4 w-4" />
					<span>Latest Backup</span>
				</div>
				<p className="text-2xl font-semibold">{latest}</p>
			</div>
		</div>
	)
}
