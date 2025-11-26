import { NextResponse } from "next/server";
import { createBackup, getBackups, cleanupOldBackups } from "@/lib/services";
import { BACKUP } from "@/lib/config";

export async function GET() {
  try {
    const backups = await getBackups(BACKUP.FETCH_LIMIT);
    return NextResponse.json({
      success: true,
      backups: backups.map((b) => ({
        id: b.id,
        backup_type: b.backup_type,
        created_at: b.created_at,
        description: b.description,
        ticket_count: b.ticket_data ? Object.keys(b.ticket_data).length : 0, 
        settings_count: b.app_settings ? Object.keys(b.app_settings).length : 0,
        comments_count: b.scheduled_comments ? b.scheduled_comments.length : 0,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const backupType = body.type === "manual" ? "manual" : "auto";
    const description = body.description || undefined;

    const backup = await createBackup(backupType, description);

    if (!backup) {
      return NextResponse.json(
        { success: false, error: "Failed to create backup" },
        { status: 500 }
      );
    }

    await cleanupOldBackups(BACKUP.MAX_COUNT);

    return NextResponse.json({
      success: true,
      backup: {
        id: backup.id,
        backup_type: backup.backup_type,
        created_at: backup.created_at,
        description: backup.description,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
