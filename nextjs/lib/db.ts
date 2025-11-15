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

export default pool;
