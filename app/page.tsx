import { Suspense } from "react"
import { connection } from "next/server"
import { DashboardClient } from "@/components/dashboard-client"
import {
	getThemePreference,
	initDatabase,
	loadTicketData,
} from "@/lib/services/database"
import { getTicketsWithSavedData } from "@/lib/services/jira"
import { isValidTheme, type Theme } from "@/lib/types"
import { DEFAULT_THEME } from "@/lib/constants"

async function DashboardWithData() {
	// Opt into dynamic rendering - required for database access
	await connection()
	await initDatabase()

	const [themePreference, savedData] = await Promise.all([
		getThemePreference(),
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
