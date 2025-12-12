"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Database, RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { trpc } from "@/components/trpc-provider"
import {
	BackupStats,
	BackupTable,
	RestoreDialog,
	getBackupStats,
	type BackupItem,
} from "./backup"

interface BackupClientProps {
	initialBackups: BackupItem[]
}

export function BackupClient({ initialBackups }: BackupClientProps) {
	const router = useRouter()
	const [restoring, setRestoring] = useState(false)
	const [restoreDialog, setRestoreDialog] = useState(false)
	const [selectedBackup, setSelectedBackup] = useState<BackupItem | null>(null)

	const {
		data: backupsData,
		isLoading: loading,
		refetch: refetchBackups,
	} = trpc.backup.getAll.useQuery()

	const backups = backupsData?.backups || initialBackups

	const restoreBackupMutation = trpc.backup.restore.useMutation({
		onSuccess: () => {
			toast.success(`Restored from backup #${selectedBackup?.id}`)
			setRestoreDialog(false)
			setSelectedBackup(null)
			refetchBackups()
			router.refresh()
		},
		onError: (error) => {
			toast.error("Error restoring backup: " + error.message)
		},
	})

	const handleRefresh = async () => {
		await refetchBackups()
		toast.success("Backups refreshed")
	}

	const handleRestore = async () => {
		if (!selectedBackup) return
		setRestoring(true)
		try {
			await restoreBackupMutation.mutateAsync({ backupId: selectedBackup.id })
		} finally {
			setRestoring(false)
		}
	}

	const openRestoreDialog = (backup: BackupItem) => {
		setSelectedBackup(backup)
		setRestoreDialog(true)
	}

	const stats = getBackupStats(backups)

	return (
		<div className="min-h-screen bg-background">
			<header className="sticky top-0 z-50 h-[52px] border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="flex h-full items-center justify-between px-6">
					<div className="flex items-center gap-3">
						<Database className="h-5 w-5 text-primary" />
						<h1 className="text-lg font-semibold">Backup Manager</h1>
						<span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
							Auto-backup every hour
						</span>
					</div>

					<div className="flex items-center gap-2">
						<ThemeToggle />
						<Button
							variant="ghost"
							size="sm"
							onClick={handleRefresh}
							disabled={loading}
						>
							<RefreshCw
								className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
							/>
						</Button>
					</div>
				</div>
			</header>

			<BackupStats
				total={stats.total}
				auto={stats.auto}
				manual={stats.manual}
				latest={stats.latest}
			/>

			<div className="px-6 pb-6">
				<BackupTable backups={backups} onRestore={openRestoreDialog} />

				<div className="mt-4 p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
					<div className="flex items-start gap-3">
						<AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
						<div>
							<p className="font-medium text-yellow-500">Backup Information</p>
							<ul className="text-sm text-muted-foreground mt-1 space-y-1">
								<li>Auto backups run every hour at minute 0</li>
								<li>
									Only the last 24 backups are kept (older ones are automatically
									deleted)
								</li>
								<li>
									Restoring will replace all current data with the backup data
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<RestoreDialog
				open={restoreDialog}
				onOpenChange={setRestoreDialog}
				backup={selectedBackup}
				restoring={restoring}
				onRestore={handleRestore}
			/>
		</div>
	)
}
