"use client"

import { AlertTriangle, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { BackupItem } from "./backup-types"
import { formatDate } from "./backup-types"

interface RestoreDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	backup: BackupItem | null
	restoring: boolean
	onRestore: () => void
}

export function RestoreDialog({
	open,
	onOpenChange,
	backup,
	restoring,
	onRestore,
}: RestoreDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-yellow-500" />
						Restore from Backup #{backup?.id}
					</DialogTitle>
					<DialogDescription className="text-destructive">
						This will replace ALL current data with the backup data. This action
						cannot be undone. Make sure to create a backup first if needed.
					</DialogDescription>
				</DialogHeader>
				{backup && (
					<div className="py-4 space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="text-muted-foreground">Created:</span>
							<span>{formatDate(backup.created_at)}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Type:</span>
							<Badge variant={backup.backup_type === "auto" ? "secondary" : "default"}>
								{backup.backup_type}
							</Badge>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Tickets:</span>
							<span>{backup.ticket_count} items</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Settings:</span>
							<span>{backup.settings_count} items</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Scheduled Comments:</span>
							<span>{backup.comments_count} items</span>
						</div>
					</div>
				)}
				<DialogFooter>
					<Button variant="ghost" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={onRestore}
						disabled={restoring}
					>
						<Upload className={`h-4 w-4 mr-2 ${restoring ? "animate-pulse" : ""}`} />
						{restoring ? "Restoring..." : "Restore Backup"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
