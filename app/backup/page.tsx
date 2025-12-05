import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { BackupClient } from "@/components/backup-client";
import { getBackups, transformBackupToItem } from "@/lib/services";
import { CACHE, BACKUP } from "@/lib/config";
import type { BackupItem } from "@/lib/types";

async function getCachedBackups(): Promise<BackupItem[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE.TAGS.BACKUPS);

  try {
    const backups = await getBackups(BACKUP.FETCH_LIMIT);
    const items = await Promise.all(backups.map(transformBackupToItem));
    console.log("[Cache] Backups:", items.length);
    return items;
  } catch (error: any) {
    console.error("[Cache] Error:", error.message);
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
