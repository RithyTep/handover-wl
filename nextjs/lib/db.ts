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
    console.log("Database table initialized");
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

export default pool;
