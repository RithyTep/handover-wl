import { withClient, withTransaction } from "./database.repository";
import { SCHEDULER } from "@/lib/config";

export class SettingsRepository {
  async get(key: string): Promise<string | null> {
    return withClient(async (client) => {
      const result = await client.query("SELECT value FROM app_settings WHERE key = $1", [key]);
      return result.rows[0]?.value || null;
    }, null);
  }

  async set(key: string, value: string): Promise<void> {
    await withClient(async (client) => {
      await client.query(
        `INSERT INTO app_settings (key, value, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
        [key, value]
      );
    }, undefined);
  }

  async getSchedulerEnabled(): Promise<boolean> {
    return withClient(async (client) => {
      const result = await client.query("SELECT value FROM app_settings WHERE key = 'scheduler_enabled'");
      return result.rows.length === 0 ? true : result.rows[0].value === "true";
    }, true);
  }

  async setSchedulerEnabled(enabled: boolean): Promise<void> {
    await this.set("scheduler_enabled", enabled.toString());
  }

  async getTriggerTimes(): Promise<{ time1: string; time2: string }> {
    return withClient(async (client) => {
      const result = await client.query(
        "SELECT key, value FROM app_settings WHERE key IN ('trigger_time_1', 'trigger_time_2')"
      );
      const times = { time1: SCHEDULER.DEFAULT_TIME_1, time2: SCHEDULER.DEFAULT_TIME_2 };
      for (const row of result.rows) {
        if (row.key === "trigger_time_1") times.time1 = row.value;
        if (row.key === "trigger_time_2") times.time2 = row.value;
      }
      return times;
    }, { time1: SCHEDULER.DEFAULT_TIME_1, time2: SCHEDULER.DEFAULT_TIME_2 });
  }

  async setTriggerTimes(time1: string, time2: string): Promise<void> {
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

  async getCustomChannelId(): Promise<string | null> {
    return this.get("custom_channel_id");
  }

  async setCustomChannelId(value: string): Promise<void> {
    await this.set("custom_channel_id", value);
  }

  async getMemberMentions(): Promise<string | null> {
    return this.get("member_mentions");
  }

  async setMemberMentions(value: string): Promise<void> {
    await this.set("member_mentions", value);
  }

  async getEveningUserToken(): Promise<string | null> {
    return this.get("evening_user_token");
  }

  async setEveningUserToken(value: string): Promise<void> {
    await this.set("evening_user_token", value);
  }

  async getNightUserToken(): Promise<string | null> {
    return this.get("night_user_token");
  }

  async setNightUserToken(value: string): Promise<void> {
    await this.set("night_user_token", value);
  }

  async getEveningMentions(): Promise<string | null> {
    return this.get("evening_mentions");
  }

  async setEveningMentions(value: string): Promise<void> {
    await this.set("evening_mentions", value);
  }

  async getNightMentions(): Promise<string | null> {
    return this.get("night_mentions");
  }

  async setNightMentions(value: string): Promise<void> {
    await this.set("night_mentions", value);
  }
}
