import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { ChristmasLoading } from "@/components/christmas-loading";
import { DashboardClient } from "@/components/dashboard-client";
import { initDatabase, loadTicketData, getTicketsWithSavedData } from "@/lib/services";
import { CACHE } from "@/lib/config";
import type { Ticket } from "@/lib/types";

async function getCachedTickets(): Promise<Ticket[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE.TAGS.TICKETS, CACHE.TAGS.DASHBOARD);

  try {
    await initDatabase();
    const savedData = await loadTicketData();
    const tickets = await getTicketsWithSavedData(savedData);
    console.log("[Cache] Tickets:", tickets.length);
    return tickets;
  } catch (error: any) {
    console.error("[Cache] Error:", error.message);
    return [];
  }
}

function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-dvh christmas-bg">
      <ChristmasLoading />
    </div>
  );
}

async function DashboardContent() {
  const tickets = await getCachedTickets();
  return <DashboardClient initialTickets={tickets} />;
}

export default function Dashboard() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}

export const metadata = {
  title: "Jira Handover Dashboard",
  description: "Manage and track Jira ticket handovers with ease",
};
