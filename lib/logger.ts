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

function getCurrentLogLevel(): LogLevel {
  const envLevel = process.env.LOG_LEVEL as LogLevel | undefined;
  if (envLevel && LOG_LEVELS[envLevel] !== undefined) {
    return envLevel;
  }
  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

function shouldLog(level: LogLevel): boolean {
  const currentLevel = getCurrentLogLevel();
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function formatLogEntry(entry: LogEntry): string {
  if (process.env.NODE_ENV === "production") {
    return JSON.stringify(entry);
  }

  const levelColors: Record<LogLevel, string> = {
    debug: "\x1b[36m",
    info: "\x1b[32m",
    warn: "\x1b[33m",
    error: "\x1b[31m",
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

function isBuildPhase(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

function log(
  level: LogLevel,
  service: string,
  message: string,
  context?: LogContext
): void {
  if (!shouldLog(level)) return;

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

  if (level === "error" || level === "warn") {
    console.error(formatted);
  } else {
    // eslint-disable-next-line no-console
    console.log(formatted);
  }
}

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

export const logger = {
	app: createLogger("App"),
	db: createLogger("Database"),
	database: createLogger("Database"),
	jira: createLogger("Jira"),
	slack: createLogger("Slack"),
	scheduler: createLogger("Scheduler"),
	api: createLogger("API"),
	auth: createLogger("Auth"),
	security: createLogger("Security"),
}

export type Logger = ReturnType<typeof createLogger>;
