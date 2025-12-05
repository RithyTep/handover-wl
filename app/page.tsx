import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { DashboardClient } from "@/components/dashboard-client";
import { getThemePreference, initDatabase, loadTicketData } from "@/lib/services/database";
import { getTicketsWithSavedData } from "@/lib/services/jira";
import { Theme } from "@/enums/theme.enum";
import { DEFAULT_THEME } from "@/lib/constants";

// Cache theme preference for 5 minutes - only calls DB every 5 min
const getCachedTheme = unstable_cache(
  async () => {
    await initDatabase();
    return getThemePreference();
  },
  ["theme-preference"],
  { revalidate: 300 }
);

// Async server component that fetches theme and tickets
async function DashboardWithData() {
  // Initialize database for ticket operations
  await initDatabase();

  // Theme is cached (5min), tickets fetched fresh
  const [themePreference, savedData] = await Promise.all([
    getCachedTheme(), // Uses cache, DB call only every 5 min
    loadTicketData(),
  ]);

  // Validate theme value
  const validThemes = Object.values(Theme) as string[];
  const initialTheme = validThemes.includes(themePreference)
    ? (themePreference as Theme)
    : DEFAULT_THEME;

  // Fetch tickets with saved data
  const initialTickets = await getTicketsWithSavedData(savedData);

  return <DashboardClient initialTheme={initialTheme} initialTickets={initialTickets} />;
}

// Page component with minimal Suspense boundary for prerendering
export default function Dashboard() {
  return (
    <Suspense fallback={null}>
      <DashboardWithData />
    </Suspense>
  );
}
