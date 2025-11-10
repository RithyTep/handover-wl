import { NextResponse } from "next/server";
import axios from "axios";
import { loadTicketData, initDatabase } from "@/lib/db";

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

export async function GET() {
  try {
    // Initialize database table if it doesn't exist
    await initDatabase();

    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");

    console.log("Fetching tickets from Jira...");

    const response = await axios.post(
      `${JIRA_URL}/rest/api/3/search/jql`,
      {
        jql: JQL_QUERY.trim(),
        maxResults: 100,
        fields: ["key", "summary", "status"],
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

    const tickets = response.data.issues.map((issue: any) => {
      const ticketKey = issue.key;
      const ticketData = savedData[ticketKey];
      return {
        key: ticketKey,
        summary: issue.fields.summary,
        status: issue.fields.status.name,
        jiraUrl: `${JIRA_URL}/browse/${ticketKey}`,
        savedStatus: ticketData?.status || "--",
        savedAction: ticketData?.action || "--",
      };
    });

    console.log("Returned", tickets.length, "tickets with saved data from PostgreSQL");

    return NextResponse.json({
      success: true,
      tickets,
      total: tickets.length,
      storage: "postgresql"
    });
  } catch (error: any) {
    console.error("Error fetching Jira tickets:");
    console.error("Status:", error.response?.status);
    console.error("Message:", error.message);

    return NextResponse.json(
      {
        success: false,
        error: error.response?.data?.errorMessages?.[0] || error.message || "Failed to fetch tickets",
        details: error.response?.data,
      },
      { status: 500 }
    );
  }
}
