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
import { BACKUP, TIMEZONE, TIMEOUTS } from "@/lib/config";

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const SCHEDULE_ENABLED = process.env.SCHEDULE_ENABLED === "true";

let scheduledTasks: cron.ScheduledTask[] = [];

function timeToCron(time: string): string {
  const [hour, minute] = time.split(":");
  return `${minute} ${hour} * * *`;
}

export async function initScheduler() {
  if (!SCHEDULE_ENABLED) {
    console.log("[Scheduler] Disabled. Set SCHEDULE_ENABLED=true to enable.");
    return;
  }

  console.log("[Scheduler] Initializing...");

  scheduledTasks.forEach((task) => task.stop());
  scheduledTasks = [];

  const { time1, time2 } = await getTriggerTimes();
  const cron1 = timeToCron(time1);
  const cron2 = timeToCron(time2);

  const task1 = cron.schedule(
    cron1,
    async () => {
      const isEnabled = await getSchedulerEnabled();
      if (!isEnabled) return;
      await sendScheduledSlackMessage(time1, "evening");
    },
    { timezone: TIMEZONE.NAME }
  );

  const task2 = cron.schedule(
    cron2,
    async () => {
      const isEnabled = await getSchedulerEnabled();
      if (!isEnabled) return;
      await sendScheduledSlackMessage(time2, "night");
    },
    { timezone: TIMEZONE.NAME }
  );

  const commentTask = cron.schedule(
    "* * * * *",
    async () => {
      const isEnabled = await getSchedulerEnabled();
      if (!isEnabled) return;
      await checkAndPostScheduledComments();
    },
    { timezone: TIMEZONE.NAME }
  );

  const backupTask = cron.schedule(
    "0 * * * *",
    async () => {
      console.log("[Scheduler] Running hourly backup...");
      try {
        const backup = await createBackup("auto", "Hourly automatic backup");
        if (backup) {
          console.log(`[Scheduler] Backup #${backup.id} created`);
          await cleanupOldBackups(BACKUP.MAX_COUNT);
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("[Scheduler] Backup failed:", message);
      }
    },
    { timezone: TIMEZONE.NAME }
  );

  scheduledTasks.push(task1, task2, commentTask, backupTask);

  console.log(`[Scheduler] Tasks initialized:`);
  console.log(`  - ${time1} ${TIMEZONE.OFFSET} (evening shift)`);
  console.log(`  - ${time2} ${TIMEZONE.OFFSET} (night shift)`);
  console.log(`  - Comment checker (every minute)`);
  console.log(`  - Hourly backup`);
}

async function sendScheduledSlackMessage(timeLabel: string, shift: "evening" | "night") {
  try {
    const token = shift === "evening" ? await getEveningUserToken() : await getNightUserToken();

    if (!token) {
      console.log(`[Scheduler] Skipping ${shift} shift - no token configured`);
      return;
    }

    console.log(`[Scheduler] Triggering ${shift} shift (${timeLabel})`);

    const response = await axios.post(
      `${APP_URL}/api/scheduled-slack`,
      { shift },
      { headers: { "Content-Type": "application/json" }, timeout: TIMEOUTS.SLACK }
    );

    console.log(`[Scheduler] ${shift} shift completed:`, response.data.success);

    await checkAndReplyToHandoverMessages();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Scheduler] ${shift} shift failed:`, message);
  }
}

async function checkAndReplyToHandoverMessages() {
  try {
    const scheduledComments = await getEnabledScheduledComments();
    const slackComments = scheduledComments.filter((c) => c.comment_type === "slack");

    if (slackComments.length === 0) return;

    const response = await axios.post(
      `${APP_URL}/api/scan-and-reply-handover`,
      {},
      { headers: { "Content-Type": "application/json" }, timeout: TIMEOUTS.SLACK }
    );

    console.log(`[Scheduler] Scan and reply:`, response.data.replied);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Scheduler] Handover check failed:", message);
  }
}

export function stopScheduler() {
  console.log("[Scheduler] Stopping all tasks...");
  scheduledTasks.forEach((task) => task.stop());
  scheduledTasks = [];
}

async function checkAndPostScheduledComments() {
  try {
    const scheduledComments = await getEnabledScheduledComments();
    const jiraComments = scheduledComments.filter((c) => c.comment_type === "jira");

    if (jiraComments.length === 0) return;

    const now = new Date();

    for (const comment of jiraComments) {
      try {
        const shouldRun = shouldRunCronNow(comment.cron_schedule, comment.last_posted_at, now);

        if (shouldRun) {
          console.log(`[Scheduler] Posting comment ${comment.id} to ${comment.ticket_key}`);

          await axios.post(
            `${APP_URL}/api/post-jira-comment`,
            {
              ticket_key: comment.ticket_key,
              comment_text: comment.comment_text,
              scheduled_comment_id: comment.id,
            },
            { headers: { "Content-Type": "application/json" }, timeout: TIMEOUTS.JIRA }
          );

          console.log(`[Scheduler] Comment ${comment.id} posted`);
        }
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        console.error(`[Scheduler] Comment ${comment.id} failed:`, errMsg);
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Scheduler] Comment check failed:", message);
  }
}

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

    if (timeDiff < 60000) return false;

    return isCronMatchingNow(cronSchedule, now);
  } catch {
    return false;
  }
}

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

    return checks.every(({ part, value, min, max }) =>
      part === "*" ? true : matchesCronPart(part, value, min, max)
    );
  } catch {
    return false;
  }
}

function matchesCronPart(cronPart: string, currentValue: number, min: number, max: number): boolean {
  if (cronPart === "*") return true;

  if (cronPart.includes("/")) {
    const [range, step] = cronPart.split("/");
    const stepNum = parseInt(step);
    if (range === "*") return currentValue % stepNum === 0;
  }

  if (cronPart.includes("-")) {
    const [start, end] = cronPart.split("-").map(Number);
    return currentValue >= start && currentValue <= end;
  }

  if (cronPart.includes(",")) {
    return cronPart.split(",").map(Number).includes(currentValue);
  }

  return parseInt(cronPart) === currentValue;
}

export async function triggerScheduledTask() {
  console.log("[Scheduler] Manual trigger for both shifts...");
  await sendScheduledSlackMessage("Manual - Evening", "evening");
  await sendScheduledSlackMessage("Manual - Night", "night");
}
