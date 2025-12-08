/**
 * Health Check API Endpoint
 * Implements Twelve-Factor App methodology:
 * - Factor IX: Disposability (maximize robustness with fast startup)
 * - Factor XII: Admin Processes (run admin tasks as one-off processes)
 *
 * This endpoint provides comprehensive health status for:
 * - Environment configuration
 * - Database connectivity
 * - External service availability (Jira, Slack)
 */

import { NextResponse } from "next/server";
import {
  checkDatabaseHealth,
  checkJiraHealth,
  checkSlackHealth,
} from "@/lib/services";
import { logger } from "@/lib/logger";

const log = logger.api;

interface ServiceHealth {
  status: "healthy" | "unhealthy" | "degraded";
  latency_ms?: number;
  error?: string;
}

interface EnvironmentStatus {
  DATABASE_URL: boolean;
  JIRA_URL: boolean;
  JIRA_EMAIL: boolean;
  JIRA_API_TOKEN: boolean;
  SLACK_BOT_TOKEN: boolean;
  SLACK_CHANNEL: boolean;
}

interface HealthResponse {
  status: "healthy" | "unhealthy" | "degraded";
  timestamp: string;
  version: string;
  environment: string;
  uptime_seconds: number;
  services: {
    database: ServiceHealth;
    jira: ServiceHealth;
    slack: ServiceHealth;
  };
  config: {
    all_required_set: boolean;
    environment_vars: EnvironmentStatus;
  };
}

const startTime = Date.now();

/**
 * GET /api/health
 * Returns comprehensive health status of the application
 *
 * Query parameters:
 * - deep=true: Perform deep health checks on all backing services
 * - format=simple: Return only status code (200/503)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deep = searchParams.get("deep") === "true";
  const simple = searchParams.get("format") === "simple";

  const timer = log.time("Health check");

  // Check environment variables
  const envStatus: EnvironmentStatus = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    JIRA_URL: !!process.env.JIRA_URL,
    JIRA_EMAIL: !!process.env.JIRA_EMAIL,
    JIRA_API_TOKEN: !!process.env.JIRA_API_TOKEN,
    SLACK_BOT_TOKEN: !!process.env.SLACK_BOT_TOKEN,
    SLACK_CHANNEL: !!(process.env.SLACK_CHANNEL_ID || process.env.SLACK_CHANNEL),
  };

  const allRequiredSet =
    envStatus.DATABASE_URL &&
    envStatus.JIRA_URL &&
    envStatus.JIRA_EMAIL &&
    envStatus.JIRA_API_TOKEN;

  // Initialize service health statuses
  let dbHealth: ServiceHealth = { status: "healthy" };
  let jiraHealth: ServiceHealth = { status: "healthy" };
  let slackHealth: ServiceHealth = { status: "healthy" };

  // Perform deep health checks if requested or if this is the default behavior
  if (deep) {
    // Check database
    const dbResult = await checkDatabaseHealth();
    dbHealth = {
      status: dbResult.healthy ? "healthy" : "unhealthy",
      latency_ms: dbResult.latency,
      error: dbResult.error,
    };

    // Check Jira (only if configured)
    if (allRequiredSet) {
      const jiraResult = await checkJiraHealth();
      jiraHealth = {
        status: jiraResult.healthy ? "healthy" : "degraded",
        latency_ms: jiraResult.latency,
        error: jiraResult.error,
      };
    } else {
      jiraHealth = {
        status: "unhealthy",
        error: "Missing required configuration",
      };
    }

    // Check Slack (optional service)
    if (envStatus.SLACK_BOT_TOKEN) {
      const slackResult = await checkSlackHealth();
      slackHealth = {
        status: slackResult.healthy ? "healthy" : "degraded",
        latency_ms: slackResult.latency,
        error: slackResult.error,
      };
    } else {
      slackHealth = {
        status: "degraded",
        error: "Slack not configured",
      };
    }
  } else {
    // Quick check - only verify database connectivity
    const dbResult = await checkDatabaseHealth();
    dbHealth = {
      status: dbResult.healthy ? "healthy" : "unhealthy",
      latency_ms: dbResult.latency,
      error: dbResult.error,
    };
  }

  // Determine overall health status
  const overallStatus = determineOverallStatus(
    dbHealth.status,
    jiraHealth.status,
    slackHealth.status
  );

  timer.end("Health check completed", { status: overallStatus });

  // Simple format returns only status code
  if (simple) {
    return new NextResponse(overallStatus, {
      status: overallStatus === "healthy" ? 200 : 503,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const response: HealthResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "3.6.0",
    environment: process.env.NODE_ENV || "development",
    uptime_seconds: Math.floor((Date.now() - startTime) / 1000),
    services: {
      database: dbHealth,
      jira: jiraHealth,
      slack: slackHealth,
    },
    config: {
      all_required_set: allRequiredSet,
      environment_vars: envStatus,
    },
  };

  return NextResponse.json(response, {
    status: overallStatus === "healthy" ? 200 : 503,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

/**
 * Determine overall health status based on individual service statuses
 */
function determineOverallStatus(
  database: "healthy" | "unhealthy" | "degraded",
  jira: "healthy" | "unhealthy" | "degraded",
  slack: "healthy" | "unhealthy" | "degraded"
): "healthy" | "unhealthy" | "degraded" {
  // Database is critical - if unhealthy, entire system is unhealthy
  if (database === "unhealthy") {
    return "unhealthy";
  }

  // Jira is critical - if unhealthy, entire system is unhealthy
  if (jira === "unhealthy") {
    return "unhealthy";
  }

  // If any service is degraded, system is degraded
  if (
    database === "degraded" ||
    jira === "degraded" ||
    slack === "degraded"
  ) {
    return "degraded";
  }

  return "healthy";
}
