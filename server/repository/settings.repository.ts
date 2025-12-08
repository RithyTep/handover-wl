import { withClient, withTransaction } from "./database.repository"

interface SettingRow {
	key: string
	value: string
	updated_at: Date
}

export class SettingsRepository {
	async findByKey(key: string): Promise<string | null> {
		return withClient(async (client) => {
			const result = await client.query("SELECT value FROM app_settings WHERE key = $1", [key])
			return result.rows[0]?.value ?? null
		}, null)
	}

	async findByKeys(keys: string[]): Promise<SettingRow[]> {
		return withClient(async (client) => {
			const result = await client.query(
				"SELECT key, value, updated_at FROM app_settings WHERE key = ANY($1)",
				[keys]
			)
			return result.rows
		}, [])
	}

	async findAll(): Promise<SettingRow[]> {
		return withClient(async (client) => {
			const result = await client.query("SELECT key, value, updated_at FROM app_settings")
			return result.rows
		}, [])
	}

	async upsert(key: string, value: string): Promise<void> {
		await withClient(async (client) => {
			await client.query(
				`INSERT INTO app_settings (key, value, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP)
				 ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
				[key, value]
			)
		}, undefined)
	}

	async upsertMany(settings: Record<string, string>): Promise<void> {
		await withTransaction(async (client) => {
			for (const [key, value] of Object.entries(settings)) {
				await client.query(
					`INSERT INTO app_settings (key, value, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP)
					 ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
					[key, value]
				)
			}
		})
	}

	async delete(key: string): Promise<boolean> {
		return withClient(async (client) => {
			const result = await client.query("DELETE FROM app_settings WHERE key = $1", [key])
			return (result.rowCount ?? 0) > 0
		}, false)
	}
}
