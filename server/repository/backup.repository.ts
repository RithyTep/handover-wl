import { withClient, withTransaction } from "./database.repository";
import type { Backup, BackupItem } from "@/interfaces/backup.interface";
import { BackupType } from "@/enums/backup.enum";
import { BACKUP } from "@/lib/config";

export class BackupRepository {
  async getAll(limit: number = BACKUP.FETCH_LIMIT): Promise<Backup[]> {
    return withClient(async (client) => {
      const result = await client.query("SELECT * FROM backups ORDER BY created_at DESC LIMIT $1", [limit]);
      return result.rows;
    }, []);
  }

  async getById(id: number): Promise<Backup | null> {
    return withClient(async (client) => {
      const result = await client.query("SELECT * FROM backups WHERE id = $1", [id]);
      return result.rows[0] || null;
    }, null);
  }

  async create(backupType: BackupType, description?: string): Promise<Backup> {
    return withClient(async (client) => {
      const ticketData = await client.query("SELECT ticket_key, status, action FROM ticket_data");
      const tickets: Record<string, { status: string; action: string }> = {};
      for (const row of ticketData.rows) {
        tickets[row.ticket_key] = { status: row.status, action: row.action };
      }

      const settingsData = await client.query("SELECT key, value FROM app_settings");
      const settings: Record<string, string> = {};
      for (const row of settingsData.rows) {
        settings[row.key] = row.value;
      }

      const commentsData = await client.query("SELECT * FROM scheduled_comments");

      const result = await client.query(
        `INSERT INTO backups (backup_type, ticket_data, app_settings, scheduled_comments, description)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [backupType, JSON.stringify(tickets), JSON.stringify(settings), JSON.stringify(commentsData.rows), description]
      );

      return result.rows[0];
    }, null as unknown as Backup);
  }

  async restore(backupId: number): Promise<boolean> {
    const backup = await this.getById(backupId);
    if (!backup) return false;

    return withTransaction(async (client) => {
      if (backup.ticket_data) {
        await client.query("DELETE FROM ticket_data");
        for (const [key, data] of Object.entries(backup.ticket_data)) {
          await client.query(
            "INSERT INTO ticket_data (ticket_key, status, action) VALUES ($1, $2, $3)",
            [key, data.status, data.action]
          );
        }
      }

      if (backup.app_settings) {
        for (const [key, value] of Object.entries(backup.app_settings)) {
          await client.query(
            `INSERT INTO app_settings (key, value, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP)
             ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
            [key, value]
          );
        }
      }

      if (backup.scheduled_comments) {
        await client.query("DELETE FROM scheduled_comments");
        for (const comment of backup.scheduled_comments) {
          await client.query(
            `INSERT INTO scheduled_comments (comment_type, ticket_key, comment_text, cron_schedule, enabled)
             VALUES ($1, $2, $3, $4, $5)`,
            [comment.comment_type, comment.ticket_key, comment.comment_text, comment.cron_schedule, comment.enabled]
          );
        }
      }

      return true;
    });
  }

  async cleanupOld(keepCount: number = BACKUP.MAX_COUNT): Promise<number> {
    return withClient(async (client) => {
      const result = await client.query(
        `DELETE FROM backups WHERE id NOT IN (SELECT id FROM backups ORDER BY created_at DESC LIMIT $1)`,
        [keepCount]
      );
      return result.rowCount ?? 0;
    }, 0);
  }

  transformToItem(backup: Backup): BackupItem {
    return {
      id: backup.id,
      backup_type: backup.backup_type,
      created_at: backup.created_at instanceof Date ? backup.created_at.toISOString() : String(backup.created_at),
      description: backup.description,
      ticket_count: backup.ticket_data ? Object.keys(backup.ticket_data).length : 0,
      settings_count: backup.app_settings ? Object.keys(backup.app_settings).length : 0,
      comments_count: backup.scheduled_comments ? backup.scheduled_comments.length : 0,
    };
  }
}
