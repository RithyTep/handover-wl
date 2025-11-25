import { NextResponse } from "next/server";
import { createBackup, getBackups, cleanupOldBackups } from "@/lib/db";

// GET - List all backups
export async function GET() {
  try {
    const backups = await getBackups(50);
    return NextResponse.json({
      success: true,
      backups: backups.map(b => ({
        id: b.id,
        backup_type: b.backup_type,
        created_at: b.created_at,
        description: b.description,
        ticket_count: b.ticket_data ? Object.keys(b.ticket_data).length : 0,
        settings_count: b.app_settings ? Object.keys(b.app_settings).length : 0,
        comments_count: b.scheduled_comments ? b.scheduled_comments.length : 0
      }))
    });
  } catch (error) {
    console.error("Error fetching backups:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch backups" },
      { status: 500 }
    );
  }
}

// POST - Create a new backup
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const backupType = body.type === 'manual' ? 'manual' : 'auto';
    const description = body.description || undefined;

    const backup = await createBackup(backupType, description);

    if (!backup) {
      return NextResponse.json(
        { success: false, error: "Failed to create backup" },
        { status: 500 }
      );
    }

    // Cleanup old backups (keep last 24)
    await cleanupOldBackups(24);

    return NextResponse.json({
      success: true,
      backup: {
        id: backup.id,
        backup_type: backup.backup_type,
        created_at: backup.created_at,
        description: backup.description
      }
    });
  } catch (error) {
    console.error("Error creating backup:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create backup" },
      { status: 500 }
    );
  }
}
