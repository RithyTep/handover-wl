import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { RefreshCw } from "lucide-react";
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

function BackupLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Loading backups...</p>
      </div>
    </div>
  );
}

async function BackupContent() {
  const backups = await getCachedBackups();
  return <BackupClient initialBackups={backups} />;
}

export default function BackupPage() {
  return (
    <Suspense fallback={<BackupLoading />}>
      <BackupContent />
    </Suspense>
  );
}

export const metadata = {
  title: "Backup Manager - Jira Handover",
  description: "Manage database backups and restore points",
};
