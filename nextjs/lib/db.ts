import { Pool } from "pg";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});
// Initialize database table
export async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS ticket_data (
        ticket_key VARCHAR(50) PRIMARY KEY,
        status VARCHAR(100) NOT NULL DEFAULT '--',
        action VARCHAR(100) NOT NULL DEFAULT '--',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create settings table for scheduler and other app settings
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Initialize scheduler enabled setting if not exists
    await client.query(`
      INSERT INTO app_settings (key, value, updated_at)
      VALUES ('scheduler_enabled', 'true', CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO NOTHING
    `);

    // Create scheduled_comments table for scheduling comment posts to Jira or Slack
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

    // Migrate existing scheduled_comments table to add comment_type if it doesn't exist
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

    // Create backups table for storing periodic backups
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

    // Store custom trigger times in app_settings
    await client.query(`
      INSERT INTO app_settings (key, value, updated_at)
      VALUES
        ('trigger_time_1', '17:10', CURRENT_TIMESTAMP),
        ('trigger_time_2', '22:40', CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO NOTHING
    `);

    console.log("Database tables initialized");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    client.release();
  }
}

export interface TicketData {
  ticket_key: string;
  status: string;
  action: string;
  updated_at?: Date;
}

export async function saveTicketData(tickets: Record<string, { status: string; action: string }>) {
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query("BEGIN");

    for (const [ticketKey, data] of Object.entries(tickets)) {
      await client.query(
        `
        INSERT INTO ticket_data (ticket_key, status, action, updated_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        ON CONFLICT (ticket_key)
        DO UPDATE SET
          status = EXCLUDED.status,
          action = EXCLUDED.action,
          updated_at = CURRENT_TIMESTAMP
        `,
        [ticketKey, data.status, data.action]
      );
    }

    await client.query("COMMIT");
    console.log("Saved ticket data for", Object.keys(tickets).length, "tickets");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error saving ticket data:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function loadTicketData(): Promise<Record<string, { status: string; action: string; updated_at?: string }>> {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT ticket_key, status, action, updated_at FROM ticket_data");

    const data: Record<string, { status: string; action: string; updated_at?: string }> = {};
    for (const row of result.rows) {
      data[row.ticket_key] = {
        status: row.status,
        action: row.action,
        updated_at: row.updated_at?.toISOString(),
      };
    }

    console.log("Loaded ticket data for", result.rows.length, "tickets");
    return data;
  } catch (error) {
    console.error("Error loading ticket data:", error);
    return {};
  } finally {
    client.release();
  }
}

// Get scheduler enabled state from database
export async function getSchedulerEnabled(): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT value FROM app_settings WHERE key = 'scheduler_enabled'"
    );

    if (result.rows.length === 0) {
      // Default to true if not set
      return true;
    }

    return result.rows[0].value === 'true';
  } catch (error) {
    console.error("Error getting scheduler state:", error);
    return true; // Default to true on error
  } finally {
    client.release();
  }
}

// Set scheduler enabled state in database
export async function setSchedulerEnabled(enabled: boolean): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(
      `
      INSERT INTO app_settings (key, value, updated_at)
      VALUES ('scheduler_enabled', $1, CURRENT_TIMESTAMP)
      ON CONFLICT (key)
      DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = CURRENT_TIMESTAMP
      `,
      [enabled.toString()]
    );
    console.log("Scheduler state updated to:", enabled);
  } catch (error) {
    console.error("Error setting scheduler state:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Scheduled Comments Interface
export interface ScheduledComment {
  id: number;
  comment_type: 'jira' | 'slack';
  ticket_key?: string;
  comment_text: string;
  cron_schedule: string;
  enabled: boolean;
  created_at?: Date;
  updated_at?: Date;
  last_posted_at?: Date | null;
}

// Get all scheduled comments
export async function getScheduledComments(): Promise<ScheduledComment[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM scheduled_comments ORDER BY created_at DESC"
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting scheduled comments:", error);
    return [];
  } finally {
    client.release();
  }
}

// Get enabled scheduled comments
export async function getEnabledScheduledComments(): Promise<ScheduledComment[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM scheduled_comments WHERE enabled = true ORDER BY created_at DESC"
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting enabled scheduled comments:", error);
    return [];
  } finally {
    client.release();
  }
}

// Create a new scheduled comment
export async function createScheduledComment(
  commentType: 'jira' | 'slack',
  commentText: string,
  cronSchedule: string,
  enabled: boolean = true,
  ticketKey?: string
): Promise<ScheduledComment | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      INSERT INTO scheduled_comments (comment_type, ticket_key, comment_text, cron_schedule, enabled, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
      `,
      [commentType, ticketKey || null, commentText, cronSchedule, enabled]
    );
    console.log("Created scheduled comment:", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating scheduled comment:", error);
    return null;
  } finally {
    client.release();
  }
}

// Update a scheduled comment
export async function updateScheduledComment(
  id: number,
  commentType: 'jira' | 'slack',
  commentText: string,
  cronSchedule: string,
  enabled: boolean,
  ticketKey?: string
): Promise<ScheduledComment | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      UPDATE scheduled_comments
      SET comment_type = $1, ticket_key = $2, comment_text = $3, cron_schedule = $4, enabled = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
      `,
      [commentType, ticketKey || null, commentText, cronSchedule, enabled, id]
    );
    console.log("Updated scheduled comment:", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating scheduled comment:", error);
    return null;
  } finally {
    client.release();
  }
}

// Delete a scheduled comment
export async function deleteScheduledComment(id: number): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query("DELETE FROM scheduled_comments WHERE id = $1", [id]);
    console.log("Deleted scheduled comment:", id);
    return true;
  } catch (error) {
    console.error("Error deleting scheduled comment:", error);
    return false;
  } finally {
    client.release();
  }
}

// Update last_posted_at timestamp
export async function updateLastPostedAt(id: number): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(
      "UPDATE scheduled_comments SET last_posted_at = CURRENT_TIMESTAMP WHERE id = $1",
      [id]
    );
    console.log("Updated last_posted_at for scheduled comment:", id);
  } catch (error) {
    console.error("Error updating last_posted_at:", error);
  } finally {
    client.release();
  }
}

// Get trigger times
export async function getTriggerTimes(): Promise<{ time1: string; time2: string }> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT key, value FROM app_settings WHERE key IN ('trigger_time_1', 'trigger_time_2')"
    );

    const times = { time1: '17:10', time2: '22:40' }; // defaults

    result.rows.forEach(row => {
      if (row.key === 'trigger_time_1') times.time1 = row.value;
      if (row.key === 'trigger_time_2') times.time2 = row.value;
    });

    return times;
  } catch (error) {
    console.error("Error getting trigger times:", error);
    return { time1: '17:10', time2: '22:40' };
  } finally {
    client.release();
  }
}

// Set trigger times
export async function setTriggerTimes(time1: string, time2: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO app_settings (key, value, updated_at)
      VALUES
        ('trigger_time_1', $1, CURRENT_TIMESTAMP),
        ('trigger_time_2', $2, CURRENT_TIMESTAMP)
      ON CONFLICT (key)
      DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = CURRENT_TIMESTAMP
    `, [time1, time2]);

    console.log("Trigger times updated:", time1, time2);
  } catch (error) {
    console.error("Error setting trigger times:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Get custom channel ID
export async function getCustomChannelId(): Promise<string | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT value FROM app_settings WHERE key = 'custom_channel_id'"
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].value;
  } catch (error) {
    console.error("Error getting custom channel ID:", error);
    return null;
  } finally {
    client.release();
  }
}

// Set custom channel ID
export async function setCustomChannelId(channelId: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO app_settings (key, value, updated_at)
      VALUES ('custom_channel_id', $1, CURRENT_TIMESTAMP)
      ON CONFLICT (key)
      DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = CURRENT_TIMESTAMP
    `, [channelId]);

    console.log("Custom channel ID updated:", channelId);
  } catch (error) {
    console.error("Error setting custom channel ID:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Get member mentions
export async function getMemberMentions(): Promise<string | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT value FROM app_settings WHERE key = 'member_mentions'"
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].value;
  } catch (error) {
    console.error("Error getting member mentions:", error);
    return null;
  } finally {
    client.release();
  }
}

// Set member mentions
export async function setMemberMentions(mentions: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO app_settings (key, value, updated_at)
      VALUES ('member_mentions', $1, CURRENT_TIMESTAMP)
      ON CONFLICT (key)
      DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = CURRENT_TIMESTAMP
    `, [mentions]);

    console.log("Member mentions updated:", mentions);
  } catch (error) {
    console.error("Error setting member mentions:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Get evening user token
export async function getEveningUserToken(): Promise<string | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT value FROM app_settings WHERE key = 'evening_user_token'"
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].value;
  } catch (error) {
    console.error("Error getting evening user token:", error);
    return null;
  } finally {
    client.release();
  }
}

// Set evening user token
export async function setEveningUserToken(token: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO app_settings (key, value, updated_at)
      VALUES ('evening_user_token', $1, CURRENT_TIMESTAMP)
      ON CONFLICT (key)
      DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = CURRENT_TIMESTAMP
    `, [token]);

    console.log("Evening user token updated");
  } catch (error) {
    console.error("Error setting evening user token:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Get night user token
export async function getNightUserToken(): Promise<string | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT value FROM app_settings WHERE key = 'night_user_token'"
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].value;
  } catch (error) {
    console.error("Error getting night user token:", error);
    return null;
  } finally {
    client.release();
  }
}

// Set night user token
export async function setNightUserToken(token: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO app_settings (key, value, updated_at)
      VALUES ('night_user_token', $1, CURRENT_TIMESTAMP)
      ON CONFLICT (key)
      DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = CURRENT_TIMESTAMP
    `, [token]);

    console.log("Night user token updated");
  } catch (error) {
    console.error("Error setting night user token:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Get evening member mentions
export async function getEveningMentions(): Promise<string | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT value FROM app_settings WHERE key = 'evening_mentions'"
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].value;
  } catch (error) {
    console.error("Error getting evening mentions:", error);
    return null;
  } finally {
    client.release();
  }
}

// Set evening member mentions
export async function setEveningMentions(mentions: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO app_settings (key, value, updated_at)
      VALUES ('evening_mentions', $1, CURRENT_TIMESTAMP)
      ON CONFLICT (key)
      DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = CURRENT_TIMESTAMP
    `, [mentions]);

    console.log("Evening mentions updated:", mentions);
  } catch (error) {
    console.error("Error setting evening mentions:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Get night member mentions
export async function getNightMentions(): Promise<string | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT value FROM app_settings WHERE key = 'night_mentions'"
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].value;
  } catch (error) {
    console.error("Error getting night mentions:", error);
    return null;
  } finally {
    client.release();
  }
}

// Set night member mentions
export async function setNightMentions(mentions: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO app_settings (key, value, updated_at)
      VALUES ('night_mentions', $1, CURRENT_TIMESTAMP)
      ON CONFLICT (key)
      DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = CURRENT_TIMESTAMP
    `, [mentions]);

    console.log("Night mentions updated:", mentions);
  } catch (error) {
    console.error("Error setting night mentions:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Backup Interface
export interface Backup {
  id: number;
  backup_type: 'auto' | 'manual';
  ticket_data: Record<string, { status: string; action: string }> | null;
  app_settings: Record<string, string> | null;
  scheduled_comments: ScheduledComment[] | null;
  created_at: Date;
  description: string | null;
}

// Create a new backup
export async function createBackup(
  backupType: 'auto' | 'manual' = 'auto',
  description?: string
): Promise<Backup | null> {
  const client = await pool.connect();
  try {
    // Collect all data from tables
    const ticketResult = await client.query("SELECT ticket_key, status, action FROM ticket_data");
    const settingsResult = await client.query("SELECT key, value FROM app_settings");
    const commentsResult = await client.query("SELECT * FROM scheduled_comments");

    // Transform ticket data to object format
    const ticketData: Record<string, { status: string; action: string }> = {};
    ticketResult.rows.forEach(row => {
      ticketData[row.ticket_key] = { status: row.status, action: row.action };
    });

    // Transform settings to object format
    const appSettings: Record<string, string> = {};
    settingsResult.rows.forEach(row => {
      appSettings[row.key] = row.value;
    });

    // Insert backup
    const result = await client.query(
      `
      INSERT INTO backups (backup_type, ticket_data, app_settings, scheduled_comments, description, created_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      RETURNING *
      `,
      [
        backupType,
        JSON.stringify(ticketData),
        JSON.stringify(appSettings),
        JSON.stringify(commentsResult.rows),
        description || `${backupType === 'auto' ? 'Automatic' : 'Manual'} backup`
      ]
    );

    console.log("Created backup:", result.rows[0].id);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating backup:", error);
    return null;
  } finally {
    client.release();
  }
}

// Get all backups
export async function getBackups(limit: number = 50): Promise<Backup[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM backups ORDER BY created_at DESC LIMIT $1",
      [limit]
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting backups:", error);
    return [];
  } finally {
    client.release();
  }
}

// Get a specific backup by ID
export async function getBackupById(id: number): Promise<Backup | null> {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM backups WHERE id = $1", [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting backup:", error);
    return null;
  } finally {
    client.release();
  }
}

// Restore from a backup
export async function restoreFromBackup(backupId: number): Promise<boolean> {
  const client = await pool.connect();
  try {
    // Get the backup
    const backupResult = await client.query("SELECT * FROM backups WHERE id = $1", [backupId]);
    if (backupResult.rows.length === 0) {
      console.error("Backup not found:", backupId);
      return false;
    }

    const backup = backupResult.rows[0];

    await client.query("BEGIN");

    // Restore ticket_data
    if (backup.ticket_data) {
      await client.query("DELETE FROM ticket_data");
      for (const [ticketKey, data] of Object.entries(backup.ticket_data as Record<string, { status: string; action: string }>)) {
        await client.query(
          "INSERT INTO ticket_data (ticket_key, status, action, updated_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)",
          [ticketKey, data.status, data.action]
        );
      }
    }

    // Restore app_settings
    if (backup.app_settings) {
      await client.query("DELETE FROM app_settings");
      for (const [key, value] of Object.entries(backup.app_settings as Record<string, string>)) {
        await client.query(
          "INSERT INTO app_settings (key, value, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP)",
          [key, value]
        );
      }
    }

    // Restore scheduled_comments
    if (backup.scheduled_comments) {
      await client.query("DELETE FROM scheduled_comments");
      for (const comment of backup.scheduled_comments as ScheduledComment[]) {
        await client.query(
          `INSERT INTO scheduled_comments (comment_type, ticket_key, comment_text, cron_schedule, enabled, created_at, updated_at, last_posted_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            comment.comment_type,
            comment.ticket_key || null,
            comment.comment_text,
            comment.cron_schedule,
            comment.enabled,
            comment.created_at || new Date(),
            comment.updated_at || new Date(),
            comment.last_posted_at || null
          ]
        );
      }
    }

    await client.query("COMMIT");
    console.log("Restored from backup:", backupId);
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error restoring from backup:", error);
    return false;
  } finally {
    client.release();
  }
}

// Delete old backups (keep only the most recent N backups)
export async function cleanupOldBackups(keepCount: number = 24): Promise<number> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      DELETE FROM backups
      WHERE id NOT IN (
        SELECT id FROM backups ORDER BY created_at DESC LIMIT $1
      )
      RETURNING id
      `,
      [keepCount]
    );
    console.log("Cleaned up", result.rowCount, "old backups");
    return result.rowCount || 0;
  } catch (error) {
    console.error("Error cleaning up old backups:", error);
    return 0;
  } finally {
    client.release();
  }
}

export default pool;
