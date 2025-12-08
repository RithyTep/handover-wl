import { Theme } from "@/enums"
import { isValidTheme } from "@/lib/types"
import { withClient } from "./database.repository"

export class ThemeRepository {
	async getThemePreference(): Promise<Theme> {
		return withClient(async (client) => {
			const result = await client.query(
				"SELECT value FROM app_settings WHERE key = $1",
				["theme_preference"]
			)
			if (result.rows.length === 0) {
				return Theme.CHRISTMAS
			}
			const value = result.rows[0].value
			if (isValidTheme(value)) {
				return value
			}
			return Theme.CHRISTMAS
		}, Theme.CHRISTMAS)
	}

	async setThemePreference(theme: Theme): Promise<void> {
		await withClient(async (client) => {
			await client.query(
				`INSERT INTO app_settings (key, value, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
				["theme_preference", theme]
			)
		}, undefined)
	}
}
