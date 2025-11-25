import { NextResponse } from "next/server";
import pool from "@/lib/services/database";

interface EnvVars {
  DATABASE_URL: string;
  JIRA_URL: string;
  JIRA_EMAIL: string;
  JIRA_API_TOKEN: string;
  SLACK_WEBHOOK_URL: string;
}

interface DatabaseStatus {
  status: string;
  type?: string;
  error?: string;
}

interface HealthChecks {
  timestamp: string;
  environment: string | undefined;
  envVars: EnvVars;
  database: DatabaseStatus;
}

export async function GET() {
  const envVars: EnvVars = {
    DATABASE_URL: process.env.DATABASE_URL ? "✓ Set" : "✗ Missing",
    JIRA_URL: process.env.JIRA_URL ? "✓ Set" : "✗ Missing",
    JIRA_EMAIL: process.env.JIRA_EMAIL ? "✓ Set" : "✗ Missing",
    JIRA_API_TOKEN: process.env.JIRA_API_TOKEN ? "✓ Set" : "✗ Missing",
    SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL ? "✓ Set" : "✗ Missing",
  };

  let database: DatabaseStatus = { status: "Unknown" };

  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    database = {
      status: "✓ Connected",
      type: "PostgreSQL",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    database = {
      status: "✗ Connection failed",
      error: message,
    };
  }

  const checks: HealthChecks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    envVars,
    database,
  };

  const allHealthy =
    envVars.DATABASE_URL === "✓ Set" &&
    envVars.JIRA_URL === "✓ Set" &&
    envVars.JIRA_EMAIL === "✓ Set" &&
    envVars.JIRA_API_TOKEN === "✓ Set" &&
    database.status === "✓ Connected";

  return NextResponse.json(
    { healthy: allHealthy, ...checks },
    { status: allHealthy ? 200 : 503 }
  );
}
