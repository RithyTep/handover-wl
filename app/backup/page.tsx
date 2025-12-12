import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { BackupClient } from "@/components/backup-client";
import { getBackups, transformBackupToItem } from "@/lib/services";
import { CACHE, BACKUP } from "@/lib/config";
import { logger } from "@/lib/logger";
import type { BackupItem } from "@/lib/types";

const log = logger.database;

async function getCachedBackups(): Promise<BackupItem[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE.TAGS.BACKUPS);

  try {
    const backups = await getBackups(BACKUP.FETCH_LIMIT);
    const items = await Promise.all(backups.map(transformBackupToItem));
    log.debug("Cache backups fetched", { count: items.length });
    return items;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    log.error("Cache error", { error: message });
    return [];
  }
}

async function BackupContent() {
  const backups = await getCachedBackups();
  return <BackupClient initialBackups={backups} />;
}

export default function BackupPage() {
  return (
    <Suspense fallback={null}>
      <BackupContent />
    </Suspense>
  );
}

export const metadata = {
  title: "Backup Manager - Jira Handover",
  description: "Manage database backups and restore points",
};
