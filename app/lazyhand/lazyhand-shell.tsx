"use client"

import { SchedulerPage } from "@/components/scheduler-page"

export default function LazyhandShell() {
	return (
		<div className="min-h-screen bg-background p-6">
			<div className="max-w-7xl mx-auto">
				<SchedulerPage />
			</div>
		</div>
	)
}
