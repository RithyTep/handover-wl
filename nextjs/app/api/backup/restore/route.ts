import { NextResponse } from "next/server";
import { restoreFromBackup, getBackupById } from "@/lib/db";

// POST - Restore from a backup
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const backupId = body.backupId;

    if (!backupId || typeof backupId !== 'number') {
      return NextResponse.json(
        { success: false, error: "Backup ID is required" },
        { status: 400 }
      );
    }

    // Check if backup exists
    const backup = await getBackupById(backupId);
    if (!backup) {
      return NextResponse.json(
        { success: false, error: "Backup not found" },
        { status: 404 }
      );
    }

    const success = await restoreFromBackup(backupId);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to restore from backup" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully restored from backup #${backupId}`,
      backup: {
        id: backup.id,
        backup_type: backup.backup_type,
        created_at: backup.created_at,
        description: backup.description
      }
    });
  } catch (error) {
    console.error("Error restoring from backup:", error);
    return NextResponse.json(
      { success: false, error: "Failed to restore from backup" },
      { status: 500 }
    );
  }
}
