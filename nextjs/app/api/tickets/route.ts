import { NextResponse } from "next/server";
import axios from "axios";
import fs from "fs";
import path from "path";

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

// Use Railway volume if available, otherwise fall back to local directory
// Railway mounts volumes at /mnt
const STORAGE_DIR = fs.existsSync("/mnt") ? "/mnt" : process.cwd();
const STORAGE_FILE = path.join(STORAGE_DIR, "ticket_data.json");

interface TicketData {
  [key: string]: {
    status: string;
    action: string;
    updated_at?: string;
  };
}

function loadTicketData(): TicketData {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading ticket data:", error);
  }
  return {};
}

export async function GET() {
  try {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");

    console.log("Fetching tickets from Jira...");
    console.log("URL:", `${JIRA_URL}/rest/api/3/search/jql`);
    console.log("JQL:", JQL_QUERY.trim());

    // Use the new /rest/api/3/search/jql endpoint (POST method)
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

    const savedData = loadTicketData();
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

    return NextResponse.json({
      success: true,
      tickets,
      total: tickets.length,
    });
  } catch (error: any) {
    console.error("Error fetching Jira tickets:");
    console.error("Status:", error.response?.status);
    console.error("Status Text:", error.response?.statusText);
    console.error("Data:", error.response?.data);
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
