"use client"

import { Database, Clock, FileText, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { BackupItem } from "./backup-types"
import { formatDate, getRelativeTime } from "./backup-types"

interface BackupTableProps {
	backups: BackupItem[]
	onRestore: (backup: BackupItem) => void
}

export function BackupTable({ backups, onRestore }: BackupTableProps) {
	return (
		<div className="rounded-lg border bg-card">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[80px]">ID</TableHead>
						<TableHead>Type</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Description</TableHead>
						<TableHead className="text-center">Tickets</TableHead>
						<TableHead className="text-center">Settings</TableHead>
						<TableHead className="text-center">Comments</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{backups.length === 0 ? (
						<TableRow>
							<TableCell colSpan={8} className="text-center py-8">
								<Database className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
								<p className="text-muted-foreground">No backups yet</p>
								<p className="text-sm text-muted-foreground/60">
									Create your first backup or wait for the hourly auto-backup
								</p>
							</TableCell>
						</TableRow>
					) : (
						backups.map((backup, index) => (
							<TableRow key={backup.id} className={index === 0 ? "bg-primary/5" : ""}>
								<TableCell className="font-mono text-sm">#{backup.id}</TableCell>
								<TableCell>
									<Badge variant={backup.backup_type === "auto" ? "secondary" : "default"}>
										{backup.backup_type === "auto" ? (
											<><Clock className="h-3 w-3 mr-1" /> Auto</>
										) : (
											<><FileText className="h-3 w-3 mr-1" /> Manual</>
										)}
									</Badge>
								</TableCell>
								<TableCell>
									<div className="flex flex-col">
										<span className="text-sm">{formatDate(backup.created_at)}</span>
										<span className="text-xs text-muted-foreground">
											{getRelativeTime(backup.created_at)}
										</span>
									</div>
								</TableCell>
								<TableCell className="text-muted-foreground text-sm">
									{backup.description || "-"}
								</TableCell>
								<TableCell className="text-center">
									<Badge variant="outline">{backup.ticket_count}</Badge>
								</TableCell>
								<TableCell className="text-center">
									<Badge variant="outline">{backup.settings_count}</Badge>
								</TableCell>
								<TableCell className="text-center">
									<Badge variant="outline">{backup.comments_count}</Badge>
								</TableCell>
								<TableCell className="text-right">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => onRestore(backup)}
										className="text-primary hover:text-primary"
									>
										<Upload className="h-4 w-4 mr-1" />
										Restore
									</Button>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	)
}
