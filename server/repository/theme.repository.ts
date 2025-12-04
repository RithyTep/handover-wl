import { Pool, PoolClient } from "pg";
import { Theme } from "@/enums/theme.enum";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

type QueryFn<T> = (client: PoolClient) => Promise<T>;

async function withClient<T>(fn: QueryFn<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } catch (error) {
    console.error("[ThemeRepository]", error);
    throw error;
  } finally {
    client.release();
  }
}

export class ThemeRepository {
  async getThemePreference(): Promise<Theme> {
    return withClient(async (client) => {
      const result = await client.query(
        "SELECT value FROM app_settings WHERE key = $1",
        ["theme_preference"]
      );
      if (result.rows.length === 0) {
        return Theme.CHRISTMAS;
      }
      const value = result.rows[0].value;
      if (value === Theme.DEFAULT || value === Theme.CHRISTMAS) {
        return value as Theme;
      }
      return Theme.CHRISTMAS;
    });
  }

  async setThemePreference(theme: Theme): Promise<void> {
    await withClient(async (client) => {
      await client.query(
        `INSERT INTO app_settings (key, value, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
        ["theme_preference", theme]
      );
    });
  }
}
