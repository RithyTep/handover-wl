import { Suspense } from "react"
import { unstable_cache } from "next/cache"
import { DashboardClient } from "@/components/dashboard-client"
import {
	getThemePreference,
	initDatabase,
	loadTicketData,
} from "@/lib/services/database"
import { getTicketsWithSavedData } from "@/lib/services/jira"
import { isValidTheme, type Theme } from "@/lib/types"
import { DEFAULT_THEME } from "@/lib/constants"

const getCachedTheme = unstable_cache(
	async () => {
		await initDatabase()
		return getThemePreference()
	},
	["theme-preference"],
	{ revalidate: 300 }
)

async function DashboardWithData() {
	await initDatabase()

	const [themePreference, savedData] = await Promise.all([
		getCachedTheme(),
		loadTicketData(),
	])

	const initialTheme: Theme = isValidTheme(themePreference)
		? themePreference
		: DEFAULT_THEME

	const initialTickets = await getTicketsWithSavedData(savedData)

	return (
		<DashboardClient initialTheme={initialTheme} initialTickets={initialTickets} />
	)
}

export default function Dashboard() {
	return (
		<Suspense fallback={null}>
			<DashboardWithData />
		</Suspense>
	)
}
