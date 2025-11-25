import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { RefreshCw } from "lucide-react";
import { BackupClient, BackupItem } from "@/components/backup-client";
import { getBackups } from "@/lib/db";

// Next.js 16 cached function with "use cache" directive
async function getCachedBackups(): Promise<BackupItem[]> {
  "use cache";
  cacheLife("minutes"); // 5 minute stale, 1 minute revalidate
  cacheTag("backups"); // Tag for on-demand revalidation

  try {
    console.log("[Cache] Fetching backups from database...");
    const backups = await getBackups(50);

    // Transform to BackupItem format
    const items: BackupItem[] = backups.map(b => ({
      id: b.id,
      backup_type: b.backup_type,
      created_at: b.created_at instanceof Date ? b.created_at.toISOString() : String(b.created_at),
      description: b.description,
      ticket_count: b.ticket_data ? Object.keys(b.ticket_data).length : 0,
      settings_count: b.app_settings ? Object.keys(b.app_settings).length : 0,
      comments_count: b.scheduled_comments ? b.scheduled_comments.length : 0,
    }));

    console.log("[Cache] Cached", items.length, "backups");
    return items;
  } catch (error: any) {
    console.error("[Cache] Error fetching backups:", error.message);
    return [];
  }
}

// Loading component
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

// Server component for async data
async function BackupContent() {
  const backups = await getCachedBackups();
  return <BackupClient initialBackups={backups} />;
}

// Main page component (Server Component)
export default function BackupPage() {
  return (
    <Suspense fallback={<BackupLoading />}>
      <BackupContent />
    </Suspense>
  );
}

// Metadata for SEO
export const metadata = {
  title: "Backup Manager - Jira Handover",
  description: "Manage database backups and restore points",
};
