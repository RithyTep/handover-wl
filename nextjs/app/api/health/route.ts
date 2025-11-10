import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const checks: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    envVars: {
      DATABASE_URL: process.env.DATABASE_URL ? "✓ Set" : "✗ Missing",
      JIRA_URL: process.env.JIRA_URL ? "✓ Set" : "✗ Missing",
      JIRA_EMAIL: process.env.JIRA_EMAIL ? "✓ Set" : "✗ Missing",
      JIRA_API_TOKEN: process.env.JIRA_API_TOKEN ? "✓ Set" : "✗ Missing",
      SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL ? "✓ Set" : "✗ Missing",
    },
  };

  // Test database connection
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    checks.database = {
      status: "✓ Connected",
      type: "PostgreSQL",
    };
  } catch (error: any) {
    checks.database = {
      status: "✗ Connection failed",
      error: error.message,
    };
  }

  const allHealthy =
    checks.envVars.DATABASE_URL === "✓ Set" &&
    checks.envVars.JIRA_URL === "✓ Set" &&
    checks.envVars.JIRA_EMAIL === "✓ Set" &&
    checks.envVars.JIRA_API_TOKEN === "✓ Set" &&
    checks.database.status === "✓ Connected";

  return NextResponse.json(
    {
      healthy: allHealthy,
      ...checks,
    },
    { status: allHealthy ? 200 : 503 }
  );
}
