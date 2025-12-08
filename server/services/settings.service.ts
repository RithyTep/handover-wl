import { SettingsRepository } from "@/server/repository/settings.repository"
import { SCHEDULER } from "@/lib/config"

const SETTINGS_KEYS = {
	SCHEDULER_ENABLED: "scheduler_enabled",
	TRIGGER_TIME_1: "trigger_time_1",
	TRIGGER_TIME_2: "trigger_time_2",
	CUSTOM_CHANNEL_ID: "custom_channel_id",
	MEMBER_MENTIONS: "member_mentions",
	EVENING_USER_TOKEN: "evening_user_token",
	NIGHT_USER_TOKEN: "night_user_token",
	EVENING_MENTIONS: "evening_mentions",
	NIGHT_MENTIONS: "night_mentions",
} as const

export class SettingsService {
	private repository: SettingsRepository

	constructor() {
		this.repository = new SettingsRepository()
	}

	async getSchedulerEnabled(): Promise<boolean> {
		const value = await this.repository.findByKey(SETTINGS_KEYS.SCHEDULER_ENABLED)
		return value === null ? true : value === "true"
	}

	async setSchedulerEnabled(enabled: boolean): Promise<void> {
		await this.repository.upsert(SETTINGS_KEYS.SCHEDULER_ENABLED, enabled.toString())
	}

	async getTriggerTimes(): Promise<{ time1: string; time2: string }> {
		const rows = await this.repository.findByKeys([
			SETTINGS_KEYS.TRIGGER_TIME_1,
			SETTINGS_KEYS.TRIGGER_TIME_2,
		])
		const times: { time1: string; time2: string } = {
			time1: SCHEDULER.DEFAULT_TIME_1,
			time2: SCHEDULER.DEFAULT_TIME_2,
		}
		for (const row of rows) {
			if (row.key === SETTINGS_KEYS.TRIGGER_TIME_1) times.time1 = row.value
			if (row.key === SETTINGS_KEYS.TRIGGER_TIME_2) times.time2 = row.value
		}
		return times
	}

	async setTriggerTimes(time1: string, time2: string): Promise<void> {
		await this.repository.upsertMany({
			[SETTINGS_KEYS.TRIGGER_TIME_1]: time1,
			[SETTINGS_KEYS.TRIGGER_TIME_2]: time2,
		})
	}

	async getCustomChannelId(): Promise<string | null> {
		return this.repository.findByKey(SETTINGS_KEYS.CUSTOM_CHANNEL_ID)
	}

	async setCustomChannelId(value: string): Promise<void> {
		await this.repository.upsert(SETTINGS_KEYS.CUSTOM_CHANNEL_ID, value)
	}

	async getMemberMentions(): Promise<string | null> {
		return this.repository.findByKey(SETTINGS_KEYS.MEMBER_MENTIONS)
	}

	async setMemberMentions(value: string): Promise<void> {
		await this.repository.upsert(SETTINGS_KEYS.MEMBER_MENTIONS, value)
	}

	async getEveningUserToken(): Promise<string | null> {
		return this.repository.findByKey(SETTINGS_KEYS.EVENING_USER_TOKEN)
	}

	async setEveningUserToken(value: string): Promise<void> {
		await this.repository.upsert(SETTINGS_KEYS.EVENING_USER_TOKEN, value)
	}

	async getNightUserToken(): Promise<string | null> {
		return this.repository.findByKey(SETTINGS_KEYS.NIGHT_USER_TOKEN)
	}

	async setNightUserToken(value: string): Promise<void> {
		await this.repository.upsert(SETTINGS_KEYS.NIGHT_USER_TOKEN, value)
	}

	async getEveningMentions(): Promise<string | null> {
		return this.repository.findByKey(SETTINGS_KEYS.EVENING_MENTIONS)
	}

	async setEveningMentions(value: string): Promise<void> {
		await this.repository.upsert(SETTINGS_KEYS.EVENING_MENTIONS, value)
	}

	async getNightMentions(): Promise<string | null> {
		return this.repository.findByKey(SETTINGS_KEYS.NIGHT_MENTIONS)
	}

	async setNightMentions(value: string): Promise<void> {
		await this.repository.upsert(SETTINGS_KEYS.NIGHT_MENTIONS, value)
	}
}
