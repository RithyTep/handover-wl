import { createBackup, cleanupOldBackups } from "@/lib/services"
import { logger } from "@/lib/logger"
import { BACKUP } from "@/lib/config"

const log = logger.scheduler

export async function runHourlyBackup(): Promise<void> {
	log.info("Running hourly backup...")
	try {
		const backup = await createBackup("auto", "Hourly automatic backup")
		if (backup) {
			log.info("Backup created", { backupId: backup.id })
			await cleanupOldBackups(BACKUP.MAX_COUNT)
		}
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error"
		log.error("Backup failed", { error: message })
	}
}
