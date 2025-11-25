"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Database,
  RefreshCw,
  Download,
  Upload,
  Clock,
  HardDrive,
  FileText,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

export interface BackupItem {
  id: number;
  backup_type: "auto" | "manual";
  created_at: string;
  description: string | null;
  ticket_count: number;
  settings_count: number;
  comments_count: number;
}

interface BackupClientProps {
  initialBackups: BackupItem[];
}

export function BackupClient({ initialBackups }: BackupClientProps) {
  const router = useRouter();
  const [backups, setBackups] = useState<BackupItem[]>(initialBackups);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const [restoreDialog, setRestoreDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupItem | null>(null);

  const handleRefresh = async () => {
    setLoading(true);
    await fetch("/api/revalidate?tag=backups");
    router.refresh();
    setLoading(false);
    toast.success("Backups refreshed");
  };

  const handleCreateBackup = async () => {
    try {
      setCreating(true);
      const response = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "manual", description: "Manual backup" }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Backup #${data.backup.id} created successfully`);
        await fetch("/api/revalidate?tag=backups");
        router.refresh();
      } else {
        toast.error(data.error || "Failed to create backup");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Error creating backup: " + message);
    } finally {
      setCreating(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedBackup) return;

    try {
      setRestoring(true);
      const response = await fetch("/api/backup/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backupId: selectedBackup.id }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Restored from backup #${selectedBackup.id}`);
        setRestoreDialog(false);
        setSelectedBackup(null);
        await fetch("/api/revalidate");
        router.refresh();
      } else {
        toast.error(data.error || "Failed to restore backup");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Error restoring backup: " + message);
    } finally {
      setRestoring(false);
    }
  };

  const openRestoreDialog = (backup: BackupItem) => {
    setSelectedBackup(backup);
    setRestoreDialog(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const stats = {
    total: backups.length,
    auto: backups.filter((b) => b.backup_type === "auto").length,
    manual: backups.filter((b) => b.backup_type === "manual").length,
    latest: backups[0] ? getRelativeTime(backups[0].created_at) : "Never",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            <Button
              variant="default"
              size="sm"
              onClick={handleCreateBackup}
              disabled={creating}
            >
              <Download className={`h-4 w-4 mr-2 ${creating ? "animate-pulse" : ""}`} />
              {creating ? "Creating..." : "Create Backup"}
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="px-6 py-4 grid grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <HardDrive className="h-4 w-4" />
            <span>Total Backups</span>
          </div>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Clock className="h-4 w-4" />
            <span>Auto Backups</span>
          </div>
          <p className="text-2xl font-semibold">{stats.auto}</p>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <FileText className="h-4 w-4" />
            <span>Manual Backups</span>
          </div>
          <p className="text-2xl font-semibold">{stats.manual}</p>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Settings className="h-4 w-4" />
            <span>Latest Backup</span>
          </div>
          <p className="text-2xl font-semibold">{stats.latest}</p>
        </div>
      </div>

      {/* Backup Table */}
      <div className="px-6 pb-6">
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
                        onClick={() => openRestoreDialog(backup)}
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

        {/* Info Note */}
        <div className="mt-4 p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-500">Backup Information</p>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>Auto backups run every hour at minute 0</li>
                <li>Only the last 24 backups are kept (older ones are automatically deleted)</li>
                <li>Restoring will replace all current data with the backup data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Restore Confirmation Dialog */}
      <Dialog open={restoreDialog} onOpenChange={setRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Restore from Backup #{selectedBackup?.id}
            </DialogTitle>
            <DialogDescription className="text-destructive">
              This will replace ALL current data with the backup data. This action
              cannot be undone. Make sure to create a backup first if needed.
            </DialogDescription>
          </DialogHeader>
          {selectedBackup && (
            <div className="py-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{formatDate(selectedBackup.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <Badge variant={selectedBackup.backup_type === "auto" ? "secondary" : "default"}>
                  {selectedBackup.backup_type}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tickets:</span>
                <span>{selectedBackup.ticket_count} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Settings:</span>
                <span>{selectedBackup.settings_count} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scheduled Comments:</span>
                <span>{selectedBackup.comments_count} items</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRestoreDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRestore}
              disabled={restoring}
            >
              <Upload className={`h-4 w-4 mr-2 ${restoring ? "animate-pulse" : ""}`} />
              {restoring ? "Restoring..." : "Restore Backup"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
