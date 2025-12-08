/**
 * Structured Logging Utility
 * Implements Twelve-Factor App methodology - Factor XI: Logs
 *
 * Treats logs as event streams. The app should never concern itself with
 * routing or storage of its output stream. Instead, each running process
 * writes its event stream, unbuffered, to stdout.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  context?: LogContext;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Get current log level from environment
 * Defaults to 'info' in production, 'debug' in development
 */
function getCurrentLogLevel(): LogLevel {
  const envLevel = process.env.LOG_LEVEL as LogLevel | undefined;
  if (envLevel && LOG_LEVELS[envLevel] !== undefined) {
    return envLevel;
  }
  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

/**
 * Check if a log level should be output
 */
function shouldLog(level: LogLevel): boolean {
  const currentLevel = getCurrentLogLevel();
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

/**
 * Format log entry as JSON for structured logging
 * In production, outputs JSON for log aggregation tools
 * In development, outputs human-readable format
 */
function formatLogEntry(entry: LogEntry): string {
  if (process.env.NODE_ENV === "production") {
    return JSON.stringify(entry);
  }

  const levelColors: Record<LogLevel, string> = {
    debug: "\x1b[36m", // Cyan
    info: "\x1b[32m", // Green
    warn: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
  };
  const reset = "\x1b[0m";
  const dim = "\x1b[2m";

  const color = levelColors[entry.level];
  const levelStr = entry.level.toUpperCase().padEnd(5);
  const contextStr = entry.context
    ? ` ${dim}${JSON.stringify(entry.context)}${reset}`
    : "";

  return `${dim}${entry.timestamp}${reset} ${color}[${levelStr}]${reset} ${dim}[${entry.service}]${reset} ${entry.message}${contextStr}`;
}

/**
 * Check if we're in a build/static generation phase
 * During static generation, we should avoid dynamic operations like new Date()
 */
function isBuildPhase(): boolean {
  // NEXT_PHASE is set during build
  return process.env.NEXT_PHASE === "phase-production-build";
}

/**
 * Create a log entry and output to stdout/stderr
 */
function log(
  level: LogLevel,
  service: string,
  message: string,
  context?: LogContext
): void {
  if (!shouldLog(level)) return;

  // Skip logging during static generation to avoid Date issues
  // Logs will still work at runtime
  if (isBuildPhase()) {
    return;
  }

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    service,
    message,
    ...(context && Object.keys(context).length > 0 && { context }),
  };

  const formatted = formatLogEntry(entry);

  // Use stderr for warnings and errors (standard practice)
  if (level === "error" || level === "warn") {
    console.error(formatted);
  } else {
    console.log(formatted);
  }
}

/**
 * Create a logger instance for a specific service/module
 * This provides a consistent interface for logging throughout the app
 */
export function createLogger(service: string) {
  return {
    debug: (message: string, context?: LogContext) =>
      log("debug", service, message, context),
    info: (message: string, context?: LogContext) =>
      log("info", service, message, context),
    warn: (message: string, context?: LogContext) =>
      log("warn", service, message, context),
    error: (message: string, context?: LogContext) =>
      log("error", service, message, context),

    /**
     * Log with timing information
     * Useful for performance monitoring
     */
    time: (label: string) => {
      const start = Date.now();
      return {
        end: (message?: string, context?: LogContext) => {
          const duration = Date.now() - start;
          log("info", service, message || label, {
            ...context,
            duration_ms: duration,
          });
        },
      };
    },

    /**
     * Create a child logger with additional context
     */
    child: (childContext: LogContext) => {
      return {
        debug: (message: string, context?: LogContext) =>
          log("debug", service, message, { ...childContext, ...context }),
        info: (message: string, context?: LogContext) =>
          log("info", service, message, { ...childContext, ...context }),
        warn: (message: string, context?: LogContext) =>
          log("warn", service, message, { ...childContext, ...context }),
        error: (message: string, context?: LogContext) =>
          log("error", service, message, { ...childContext, ...context }),
      };
    },
  };
}

/**
 * Pre-configured loggers for common services
 */
export const logger = {
  app: createLogger("App"),
  db: createLogger("Database"),
  jira: createLogger("Jira"),
  slack: createLogger("Slack"),
  scheduler: createLogger("Scheduler"),
  api: createLogger("API"),
  auth: createLogger("Auth"),
};

export type Logger = ReturnType<typeof createLogger>;
