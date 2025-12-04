import { Pool, PoolClient } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

type QueryFn<T> = (client: PoolClient) => Promise<T>;

async function withClient<T>(fn: QueryFn<T>, fallback: T): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } catch (error) {
    console.error("[DatabaseRepository]", error);
    return fallback;
  } finally {
    client.release();
  }
}

async function withTransaction<T>(fn: QueryFn<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function initDatabase(): Promise<void> {
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

    console.log("[DatabaseRepository] Tables initialized");
  }, undefined);
}

export { pool, withClient, withTransaction };
