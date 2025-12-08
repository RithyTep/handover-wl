/**
 * Scheduler Service
 * Implements Twelve-Factor App methodology:
 * - Factor VI: Processes (stateless execution model)
 * - Factor VIII: Concurrency (scale out via process model)
 * - Factor IX: Disposability (fast startup, graceful shutdown)
 */

import * as cron from "node-cron";
import axios from "axios";
import {
  getSchedulerEnabled,
  getEnabledScheduledComments,
  getTriggerTimes,
  getEveningUserToken,
  getNightUserToken,
  createBackup,
  cleanupOldBackups,
} from "@/lib/services";
import { getAppConfig } from "@/lib/env";
import { logger } from "@/lib/logger";
import { BACKUP, TIMEZONE, TIMEOUTS } from "@/lib/config";

const log = logger.scheduler;

/**
 * Get app configuration from environment
 */
const getConfig = () => getAppConfig();

let scheduledTasks: cron.ScheduledTask[] = [];

/**
 * Convert HH:MM time to cron expression
 */
function timeToCron(time: string): string {
  const [hour, minute] = time.split(":");
  return `${minute} ${hour} * * *`;
}

/**
 * Initialize the scheduler
 * Sets up cron jobs for:
 * - Evening and night shift handovers
 * - Scheduled comment checker
 * - Hourly automatic backups
 */
export async function initScheduler(): Promise<void> {
  const config = getConfig();

  if (!config.schedulerEnabled) {
    log.info("Scheduler disabled. Set SCHEDULE_ENABLED=true to enable.");
    return;
  }

  log.info("Initializing scheduler...");

  // Stop existing tasks (Factor IX: Disposability)
  scheduledTasks.forEach((task) => task.stop());
  scheduledTasks = [];

  const { time1, time2 } = await getTriggerTimes();
  const cron1 = timeToCron(time1);
  const cron2 = timeToCron(time2);

  // Evening shift task
  const task1 = cron.schedule(
    cron1,
    async () => {
      const isEnabled = await getSchedulerEnabled();
      if (!isEnabled) return;
      await sendScheduledSlackMessage(time1, "evening");
    },
    { timezone: TIMEZONE.NAME }
  );

  // Night shift task
  const task2 = cron.schedule(
    cron2,
    async () => {
      const isEnabled = await getSchedulerEnabled();
      if (!isEnabled) return;
      await sendScheduledSlackMessage(time2, "night");
    },
    { timezone: TIMEZONE.NAME }
  );

  // Scheduled comment checker (runs every minute)
  const commentTask = cron.schedule(
    "* * * * *",
    async () => {
      const isEnabled = await getSchedulerEnabled();
      if (!isEnabled) return;
      await checkAndPostScheduledComments();
    },
    { timezone: TIMEZONE.NAME }
  );

  // Hourly backup task
  const backupTask = cron.schedule(
    "0 * * * *",
    async () => {
      log.info("Running hourly backup...");
      try {
        const backup = await createBackup("auto", "Hourly automatic backup");
        if (backup) {
          log.info("Backup created", { backupId: backup.id });
          await cleanupOldBackups(BACKUP.MAX_COUNT);
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        log.error("Backup failed", { error: message });
      }
    },
    { timezone: TIMEZONE.NAME }
  );

  scheduledTasks.push(task1, task2, commentTask, backupTask);

  log.info("Scheduler initialized", {
    eveningShift: `${time1} ${TIMEZONE.OFFSET}`,
    nightShift: `${time2} ${TIMEZONE.OFFSET}`,
    commentChecker: "every minute",
    backup: "hourly",
  });
}

/**
 * Send scheduled Slack message for a shift
 */
async function sendScheduledSlackMessage(
  timeLabel: string,
  shift: "evening" | "night"
): Promise<void> {
  const config = getConfig();

  try {
    const token =
      shift === "evening" ? await getEveningUserToken() : await getNightUserToken();

    if (!token) {
      log.info("Skipping shift - no token configured", { shift });
      return;
    }

    log.info("Triggering shift", { shift, timeLabel });

    const response = await axios.post(
      `${config.url}/api/scheduled-slack`,
      { shift },
      { headers: { "Content-Type": "application/json" }, timeout: TIMEOUTS.SLACK }
    );

    log.info("Shift completed", { shift, success: response.data.success });

    await checkAndReplyToHandoverMessages();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    log.error("Shift failed", { shift, error: message });
  }
}

/**
 * Check and reply to handover messages
 */
async function checkAndReplyToHandoverMessages(): Promise<void> {
  const config = getConfig();

  try {
    const scheduledComments = await getEnabledScheduledComments();
    const slackComments = scheduledComments.filter((c) => c.comment_type === "slack");

    if (slackComments.length === 0) return;

    const response = await axios.post(
      `${config.url}/api/scan-and-reply-handover`,
      {},
      { headers: { "Content-Type": "application/json" }, timeout: TIMEOUTS.SLACK }
    );

    log.info("Handover scan completed", { replied: response.data.replied });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    log.error("Handover check failed", { error: message });
  }
}

/**
 * Stop all scheduled tasks
 * Implements Factor IX: Disposability (graceful shutdown)
 */
export function stopScheduler(): void {
  log.info("Stopping all scheduled tasks...");
  scheduledTasks.forEach((task) => task.stop());
  scheduledTasks = [];
  log.info("Scheduler stopped");
}

/**
 * Check and post scheduled Jira comments
 */
async function checkAndPostScheduledComments(): Promise<void> {
  const config = getConfig();

  try {
    const scheduledComments = await getEnabledScheduledComments();
    const jiraComments = scheduledComments.filter((c) => c.comment_type === "jira");

    if (jiraComments.length === 0) return;

    const now = new Date();

    for (const comment of jiraComments) {
      try {
        const shouldRun = shouldRunCronNow(
          comment.cron_schedule,
          comment.last_posted_at,
          now
        );

        if (shouldRun) {
          log.info("Posting scheduled comment", {
            commentId: comment.id,
            ticketKey: comment.ticket_key,
          });

          await axios.post(
            `${config.url}/api/post-jira-comment`,
            {
              ticket_key: comment.ticket_key,
              comment_text: comment.comment_text,
              scheduled_comment_id: comment.id,
            },
            { headers: { "Content-Type": "application/json" }, timeout: TIMEOUTS.JIRA }
          );

          log.info("Scheduled comment posted", { commentId: comment.id });
        }
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        log.error("Failed to post comment", {
          commentId: comment.id,
          error: errMsg,
        });
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    log.error("Comment check failed", { error: message });
  }
}

/**
 * Determine if a cron job should run now
 */
function shouldRunCronNow(
  cronSchedule: string,
  lastPostedAt: Date | null | undefined,
  now: Date
): boolean {
  try {
    if (!lastPostedAt) {
      return isCronMatchingNow(cronSchedule, now);
    }

    const lastPosted = new Date(lastPostedAt);
    const timeDiff = now.getTime() - lastPosted.getTime();

    // Prevent running more than once per minute
    if (timeDiff < 60000) return false;

    return isCronMatchingNow(cronSchedule, now);
  } catch {
    return false;
  }
}

/**
 * Check if current time matches cron expression
 */
function isCronMatchingNow(cronSchedule: string, now: Date): boolean {
  try {
    const parts = cronSchedule.trim().split(/\s+/);
    if (parts.length !== 5) return false;

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    const checks = [
      { part: minute, value: now.getMinutes(), min: 0, max: 59 },
      { part: hour, value: now.getHours(), min: 0, max: 23 },
      { part: dayOfMonth, value: now.getDate(), min: 1, max: 31 },
      { part: month, value: now.getMonth() + 1, min: 1, max: 12 },
      { part: dayOfWeek, value: now.getDay(), min: 0, max: 6 },
    ];

    return checks.every(({ part, value }) =>
      part === "*" ? true : matchesCronPart(part, value)
    );
  } catch {
    return false;
  }
}

/**
 * Match a single cron part against a value
 */
function matchesCronPart(cronPart: string, currentValue: number): boolean {
  if (cronPart === "*") return true;

  // Handle step values (e.g., */5)
  if (cronPart.includes("/")) {
    const [range, step] = cronPart.split("/");
    const stepNum = parseInt(step);
    if (range === "*") return currentValue % stepNum === 0;
  }

  // Handle ranges (e.g., 1-5)
  if (cronPart.includes("-")) {
    const [start, end] = cronPart.split("-").map(Number);
    return currentValue >= start && currentValue <= end;
  }

  // Handle lists (e.g., 1,3,5)
  if (cronPart.includes(",")) {
    return cronPart.split(",").map(Number).includes(currentValue);
  }

  // Direct value match
  return parseInt(cronPart) === currentValue;
}

/**
 * Manually trigger scheduled tasks
 * Used for testing or manual execution
 */
export async function triggerScheduledTask(): Promise<void> {
  log.info("Manual trigger for both shifts");
  await sendScheduledSlackMessage("Manual - Evening", "evening");
  await sendScheduledSlackMessage("Manual - Night", "night");
}
