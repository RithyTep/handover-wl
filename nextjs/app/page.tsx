import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import axios from "axios";
import { ChristmasLoading } from "@/components/christmas-loading";
import { DashboardClient } from "@/components/dashboard-client";
import { loadTicketData, initDatabase } from "@/lib/db";
import { Ticket } from "./columns";

const JIRA_URL = process.env.JIRA_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

const JQL_QUERY = `
project = TCP
AND issuetype in standardIssueTypes()
AND status in ("WL - Pending", "WL - Processing")
AND "Release Date[Date]" = EMPTY
ORDER BY created ASC, updated DESC
`;

// Next.js 16 cached function with "use cache" directive
async function getCachedTickets(): Promise<Ticket[]> {
  "use cache";
  cacheLife("minutes"); // Revalidate every minute
  cacheTag("tickets", "dashboard"); // Tags for on-demand revalidation

  try {
    // Initialize database table if it doesn't exist
    await initDatabase();

    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");

    console.log("[Cache] Fetching tickets from Jira...");

    const response = await axios.post(
      `${JIRA_URL}/rest/api/3/search/jql`,
      {
        jql: JQL_QUERY.trim(),
        maxResults: 100,
        fields: [
          "key",
          "summary",
          "status",
          "assignee",
          "created",
          "duedate",
          "issuetype",
          "customfield_10451", // WL Main Ticket Type
          "customfield_10453", // WL Sub Ticket Type
          "customfield_10400", // Customer Level
        ],
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    // Load saved data from database
    const savedData = await loadTicketData();

    const tickets: Ticket[] = response.data.issues.map((issue: any) => {
      const ticketKey = issue.key;
      const ticketData = savedData[ticketKey];
      return {
        key: ticketKey,
        summary: issue.fields.summary,
        status: issue.fields.status.name,
        assignee: issue.fields.assignee?.displayName || "Unassigned",
        assigneeAvatar: issue.fields.assignee?.avatarUrls?.["48x48"] || null,
        created: issue.fields.created,
        dueDate: issue.fields.duedate || null,
        issueType: issue.fields.issuetype?.name || "None",
        wlMainTicketType: issue.fields.customfield_10451?.value || "None",
        wlSubTicketType: issue.fields.customfield_10453?.value || "None",
        customerLevel: issue.fields.customfield_10400 || "None",
        jiraUrl: `${JIRA_URL}/browse/${ticketKey}`,
        savedStatus: ticketData?.status || "--",
        savedAction: ticketData?.action || "--",
      };
    });

    console.log("[Cache] Cached", tickets.length, "tickets");
    return tickets;
  } catch (error: any) {
    console.error("[Cache] Error fetching tickets:", error.message);
    return [];
  }
}

// Loading component
function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-dvh christmas-bg">
      <ChristmasLoading />
    </div>
  );
}

// Server component wrapper for async data
async function DashboardContent() {
  const tickets = await getCachedTickets();
  return <DashboardClient initialTickets={tickets} />;
}

// Main page component (Server Component)
export default function Dashboard() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}

// Metadata for SEO
export const metadata = {
  title: "Jira Handover Dashboard",
  description: "Manage and track Jira ticket handovers with ease",
};
