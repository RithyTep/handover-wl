/**
 * Database Service
 * Implements Twelve-Factor App methodology:
 * - Factor IV: Backing Services (treat database as attached resource)
 * - Factor VI: Processes (stateless processes, store data in backing service)
 * - Factor IX: Disposability (fast startup, graceful shutdown)
 */

import { Pool, PoolClient } from "pg";
import { getDatabaseConfig } from "@/lib/env";
import { logger } from "@/lib/logger";
import { SCHEDULER, BACKUP } from "@/lib/config";
import type {
  TicketData,
  ScheduledComment,
  Backup,
  BackupItem,
} from "@/lib/types";

const log = logger.db;

/**
 * Database connection pool
 * Configured via environment variables for portability across deployments
 */
const pool = new Pool(getDatabaseConfig());

// Handle pool errors gracefully (Factor IX: Disposability)
pool.on("error", (err) => {
  log.error("Unexpected database pool error", { error: err.message });
});

pool.on("connect", () => {
  log.debug("New database connection established");
});

type QueryFn<T> = (client: PoolClient) => Promise<T>;

/**
 * Execute a database operation with proper connection management
 * Handles connection acquisition, execution, and release
 */
async function withClient<T>(fn: QueryFn<T>, fallback: T): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    log.error("Database query failed", { error: message });
    return fallback;
  } finally {
    client.release();
  }
}

/**
 * Execute database operations within a transaction
 * Ensures atomicity for multi-statement operations
 */
async function withTransaction<T>(fn: QueryFn<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    const message = error instanceof Error ? error.message : "Unknown error";
    log.error("Transaction rolled back", { error: message });
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Initialize database schema
 * Creates tables if they don't exist (idempotent operation)
 */
export async function initDatabase(): Promise<void> {
  log.info("Initializing database schema...");

  await withClient(async (client) => {
    await client.query(`
      CREATE TABLE IF NOT EXISTS ticket_data (
        ticket_key VARCHAR(50) PRIMARY KEY,
        status VARCHAR(100) NOT NULL DEFAULT '--',
        action VARCHAR(100) NOT NULL DEFAULT '--',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      INSERT INTO app_settings (key, value, updated_at)
      VALUES ('scheduler_enabled', 'true', CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO NOTHING
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS scheduled_comments (
        id SERIAL PRIMARY KEY,
        comment_type VARCHAR(20) NOT NULL DEFAULT 'jira',
        ticket_key VARCHAR(50),
        comment_text TEXT NOT NULL,
        cron_schedule VARCHAR(100) NOT NULL,
        enabled BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_posted_at TIMESTAMP WITH TIME ZONE
      )
    `);

    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'scheduled_comments' AND column_name = 'comment_type'
        ) THEN
          ALTER TABLE scheduled_comments ADD COLUMN comment_type VARCHAR(20) NOT NULL DEFAULT 'jira';
        END IF;
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'scheduled_comments' AND column_name = 'ticket_key' AND is_nullable = 'NO'
        ) THEN
          ALTER TABLE scheduled_comments ALTER COLUMN ticket_key DROP NOT NULL;
        END IF;
      END $$;
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS backups (
        id SERIAL PRIMARY KEY,
        backup_type VARCHAR(50) NOT NULL DEFAULT 'auto',
        ticket_data JSONB,
        app_settings JSONB,
        scheduled_comments JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        description TEXT
      )
    `);

    await client.query(
      `
      INSERT INTO app_settings (key, value, updated_at)
      VALUES
        ('trigger_time_1', $1, CURRENT_TIMESTAMP),
        ('trigger_time_2', $2, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO NOTHING
    `,
      [SCHEDULER.DEFAULT_TIME_1, SCHEDULER.DEFAULT_TIME_2]
    );

    log.info("Database schema initialized successfully");
  }, undefined);
}

/**
 * Save ticket data to database
 */
export async function saveTicketData(
  tickets: Record<string, { status: string; action: string }>
): Promise<void> {
  const ticketCount = Object.keys(tickets).length;
  log.info("Saving ticket data", { count: ticketCount });

  await withTransaction(async (client) => {
    for (const [ticketKey, data] of Object.entries(tickets)) {
      await client.query(
        `INSERT INTO ticket_data (ticket_key, status, action, updated_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
         ON CONFLICT (ticket_key)
         DO UPDATE SET status = EXCLUDED.status, action = EXCLUDED.action, updated_at = CURRENT_TIMESTAMP`,
        [ticketKey, data.status, data.action]
      );
    }
    log.info("Ticket data saved", { count: ticketCount });
  });
}

/**
 * Load all ticket data from database
 */
export async function loadTicketData(): Promise<Record<string, TicketData>> {
  return withClient(async (client) => {
    const result = await client.query(
      "SELECT ticket_key, status, action, updated_at FROM ticket_data"
    );
    const data: Record<string, TicketData> = {};
    for (const row of result.rows) {
      data[row.ticket_key] = {
        status: row.status,
        action: row.action,
        updated_at: row.updated_at?.toISOString(),
      };
    }
    log.info("Ticket data loaded", { count: result.rows.length });
    return data;
  }, {});
}

/**
 * Get scheduler enabled status
 */
export async function getSchedulerEnabled(): Promise<boolean> {
  return withClient(async (client) => {
    const result = await client.query(
      "SELECT value FROM app_settings WHERE key = 'scheduler_enabled'"
    );
    return result.rows.length === 0 ? true : result.rows[0].value === "true";
  }, true);
}

/**
 * Set scheduler enabled status
 */
export async function setSchedulerEnabled(enabled: boolean): Promise<void> {
  log.info("Updating scheduler status", { enabled });
  await withClient(async (client) => {
    await client.query(
      `INSERT INTO app_settings (key, value, updated_at)
       VALUES ('scheduler_enabled', $1, CURRENT_TIMESTAMP)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
      [enabled.toString()]
    );
  }, undefined);
}

/**
 * Get all scheduled comments
 */
export async function getScheduledComments(): Promise<ScheduledComment[]> {
  return withClient(async (client) => {
    const result = await client.query(
      "SELECT * FROM scheduled_comments ORDER BY created_at DESC"
    );
    return result.rows;
  }, []);
}

/**
 * Get enabled scheduled comments only
 */
export async function getEnabledScheduledComments(): Promise<
  ScheduledComment[]
> {
  return withClient(async (client) => {
    const result = await client.query(
      "SELECT * FROM scheduled_comments WHERE enabled = true ORDER BY created_at DESC"
    );
    return result.rows;
  }, []);
}

/**
 * Create a new scheduled comment
 */
export async function createScheduledComment(
  commentType: "jira" | "slack",
  commentText: string,
  cronSchedule: string,
  enabled: boolean = true,
  ticketKey?: string
): Promise<ScheduledComment | null> {
  log.info("Creating scheduled comment", { commentType, ticketKey });
  return withClient(async (client) => {
    const result = await client.query(
      `INSERT INTO scheduled_comments (comment_type, ticket_key, comment_text, cron_schedule, enabled)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [commentType, ticketKey || null, commentText, cronSchedule, enabled]
    );
    return result.rows[0];
  }, null);
}

/**
 * Update an existing scheduled comment
 */
export async function updateScheduledComment(
  id: number,
  commentType: "jira" | "slack",
  commentText: string,
  cronSchedule: string,
  enabled: boolean,
  ticketKey?: string
): Promise<ScheduledComment | null> {
  log.info("Updating scheduled comment", { id, commentType });
  return withClient(async (client) => {
    const result = await client.query(
      `UPDATE scheduled_comments
       SET comment_type = $1, ticket_key = $2, comment_text = $3, cron_schedule = $4, enabled = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING *`,
      [commentType, ticketKey || null, commentText, cronSchedule, enabled, id]
    );
    return result.rows[0] || null;
  }, null);
}

/**
 * Delete a scheduled comment
 */
export async function deleteScheduledComment(id: number): Promise<boolean> {
  log.info("Deleting scheduled comment", { id });
  return withClient(async (client) => {
    const result = await client.query(
      "DELETE FROM scheduled_comments WHERE id = $1",
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }, false);
}

/**
 * Update the last posted timestamp for a comment
 */
export async function updateCommentLastPosted(id: number): Promise<void> {
  await withClient(async (client) => {
    await client.query(
      "UPDATE scheduled_comments SET last_posted_at = CURRENT_TIMESTAMP WHERE id = $1",
      [id]
    );
  }, undefined);
}

/**
 * Get trigger times for scheduled tasks
 */
export async function getTriggerTimes(): Promise<{
  time1: string;
  time2: string;
}> {
  return withClient(async (client) => {
    const result = await client.query(
      "SELECT key, value FROM app_settings WHERE key IN ('trigger_time_1', 'trigger_time_2')"
    );
    const times = {
      time1: SCHEDULER.DEFAULT_TIME_1,
      time2: SCHEDULER.DEFAULT_TIME_2,
    };
    for (const row of result.rows) {
      if (row.key === "trigger_time_1") times.time1 = row.value;
      if (row.key === "trigger_time_2") times.time2 = row.value;
    }
    return times;
  }, { time1: SCHEDULER.DEFAULT_TIME_1, time2: SCHEDULER.DEFAULT_TIME_2 });
}

/**
 * Set trigger times for scheduled tasks
 */
export async function setTriggerTimes(
  time1: string,
  time2: string
): Promise<void> {
  log.info("Updating trigger times", { time1, time2 });
  await withTransaction(async (client) => {
    await client.query(
      `INSERT INTO app_settings (key, value, updated_at) VALUES ('trigger_time_1', $1, CURRENT_TIMESTAMP)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
      [time1]
    );
    await client.query(
      `INSERT INTO app_settings (key, value, updated_at) VALUES ('trigger_time_2', $1, CURRENT_TIMESTAMP)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
      [time2]
    );
  });
}

/**
 * Get a setting value by key
 */
export async function getSetting(key: string): Promise<string | null> {
  return withClient(async (client) => {
    const result = await client.query(
      "SELECT value FROM app_settings WHERE key = $1",
      [key]
    );
    return result.rows[0]?.value || null;
  }, null);
}

/**
 * Set a setting value
 */
export async function setSetting(key: string, value: string): Promise<void> {
  await withClient(async (client) => {
    await client.query(
      `INSERT INTO app_settings (key, value, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
      [key, value]
    );
  }, undefined);
}

/**
 * Get all backups
 */
export async function getBackups(
  limit: number = BACKUP.FETCH_LIMIT
): Promise<Backup[]> {
  return withClient(async (client) => {
    const result = await client.query(
      "SELECT * FROM backups ORDER BY created_at DESC LIMIT $1",
      [limit]
    );
    return result.rows;
  }, []);
}

/**
 * Get a backup by ID
 */
export async function getBackupById(id: number): Promise<Backup | null> {
  return withClient(async (client) => {
    const result = await client.query("SELECT * FROM backups WHERE id = $1", [
      id,
    ]);
    return result.rows[0] || null;
  }, null);
}

/**
 * Create a new backup
 */
export async function createBackup(
  backupType: "auto" | "manual" = "auto",
  description?: string
): Promise<Backup | null> {
  log.info("Creating backup", { type: backupType });
  return withClient(async (client) => {
    const ticketData = await client.query(
      "SELECT ticket_key, status, action FROM ticket_data"
    );
    const tickets: Record<string, { status: string; action: string }> = {};
    for (const row of ticketData.rows) {
      tickets[row.ticket_key] = { status: row.status, action: row.action };
    }

    const settingsData = await client.query(
      "SELECT key, value FROM app_settings"
    );
    const settings: Record<string, string> = {};
    for (const row of settingsData.rows) {
      settings[row.key] = row.value;
    }

    const commentsData = await client.query("SELECT * FROM scheduled_comments");

    const result = await client.query(
      `INSERT INTO backups (backup_type, ticket_data, app_settings, scheduled_comments, description)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        backupType,
        JSON.stringify(tickets),
        JSON.stringify(settings),
        JSON.stringify(commentsData.rows),
        description,
      ]
    );

    log.info("Backup created", { id: result.rows[0].id });
    return result.rows[0];
  }, null);
}

/**
 * Restore from a backup
 */
export async function restoreFromBackup(backupId: number): Promise<boolean> {
  log.info("Restoring from backup", { backupId });
  const backup = await getBackupById(backupId);
  if (!backup) {
    log.error("Backup not found", { backupId });
    return false;
  }

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
          [
            comment.comment_type,
            comment.ticket_key,
            comment.comment_text,
            comment.cron_schedule,
            comment.enabled,
          ]
        );
      }
    }

    log.info("Backup restored successfully", { backupId });
    return true;
  });
}

/**
 * Cleanup old backups, keeping only the most recent ones
 */
export async function cleanupOldBackups(
  keepCount: number = BACKUP.MAX_COUNT
): Promise<number> {
  return withClient(async (client) => {
    const result = await client.query(
      `DELETE FROM backups WHERE id NOT IN (SELECT id FROM backups ORDER BY created_at DESC LIMIT $1)`,
      [keepCount]
    );
    const deleted = result.rowCount ?? 0;
    if (deleted > 0) {
      log.info("Old backups cleaned up", { deleted, kept: keepCount });
    }
    return deleted;
  }, 0);
}

/**
 * Transform backup to display item format
 */
export async function transformBackupToItem(backup: Backup): Promise<BackupItem> {
  return {
    id: backup.id,
    backup_type: backup.backup_type,
    created_at:
      backup.created_at instanceof Date
        ? backup.created_at.toISOString()
        : String(backup.created_at),
    description: backup.description,
    ticket_count: backup.ticket_data ? Object.keys(backup.ticket_data).length : 0,
    settings_count: backup.app_settings
      ? Object.keys(backup.app_settings).length
      : 0,
    comments_count: backup.scheduled_comments
      ? backup.scheduled_comments.length
      : 0,
  };
}

// Convenience exports for settings
export const getCustomChannelId = () => getSetting("custom_channel_id");
export const setCustomChannelId = (v: string) =>
  setSetting("custom_channel_id", v);

export const getMemberMentions = () => getSetting("member_mentions");
export const setMemberMentions = (v: string) => setSetting("member_mentions", v);

export const getEveningUserToken = () => getSetting("evening_user_token");
export const setEveningUserToken = (v: string) =>
  setSetting("evening_user_token", v);

export const getNightUserToken = () => getSetting("night_user_token");
export const setNightUserToken = (v: string) =>
  setSetting("night_user_token", v);

export const getEveningMentions = () => getSetting("evening_mentions");
export const setEveningMentions = (v: string) =>
  setSetting("evening_mentions", v);

export const getNightMentions = () => getSetting("night_mentions");
export const setNightMentions = (v: string) => setSetting("night_mentions", v);

export const getThemePreference = async (): Promise<string> => {
  const theme = await getSetting("theme_preference");
  return theme || "christmas";
};

export const setThemePreference = async (theme: string): Promise<void> => {
  await setSetting("theme_preference", theme);
};

/**
 * Check database connection health
 * Used for health check endpoints (Factor IX: Disposability)
 */
export async function checkHealth(): Promise<{
  healthy: boolean;
  latency: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    return {
      healthy: true,
      latency: Date.now() - start,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      healthy: false,
      latency: Date.now() - start,
      error: message,
    };
  }
}

/**
 * Graceful shutdown of database connections
 * Implements Factor IX: Disposability
 */
export async function shutdown(): Promise<void> {
  log.info("Shutting down database connections...");
  await pool.end();
  log.info("Database connections closed");
}

export default pool;
