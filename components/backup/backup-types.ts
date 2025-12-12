export interface BackupItem {
	id: number
	backup_type: "auto" | "manual"
	created_at: string
	description: string | null
	ticket_count: number
	settings_count: number
	comments_count: number
}

export function formatDate(dateString: string | Date): string {
	const date = typeof dateString === "string" ? new Date(dateString) : dateString
	return date.toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	})
}

export function getRelativeTime(dateString: string | Date): string {
	const date = typeof dateString === "string" ? new Date(dateString) : dateString
	const now = new Date()
	const diff = now.getTime() - date.getTime()
	const hours = Math.floor(diff / (1000 * 60 * 60))
	const minutes = Math.floor(diff / (1000 * 60))

	if (minutes < 1) return "Just now"
	if (minutes < 60) return `${minutes}m ago`
	if (hours < 24) return `${hours}h ago`
	return `${Math.floor(hours / 24)}d ago`
}

export function getBackupStats(backups: BackupItem[]) {
	return {
		total: backups.length,
		auto: backups.filter((b) => b.backup_type === "auto").length,
		manual: backups.filter((b) => b.backup_type === "manual").length,
		latest: backups[0] ? getRelativeTime(backups[0].created_at) : "Never",
	}
}
