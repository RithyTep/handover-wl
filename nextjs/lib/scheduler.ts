import * as cron from "node-cron";
import axios from "axios";
import { getSchedulerEnabled, getEnabledScheduledComments, getTriggerTimes, getEveningUserToken, getNightUserToken } from "./db";

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const SCHEDULE_ENABLED = process.env.SCHEDULE_ENABLED === "true";

let scheduledTasks: cron.ScheduledTask[] = [];

// Helper function to convert HH:mm to cron format
function timeToCron(time: string): string {
  const [hour, minute] = time.split(':');
  return `${minute} ${hour} * * *`;
}

export async function initScheduler() {
  if (!SCHEDULE_ENABLED) {
    console.log("[Scheduler] Scheduling is disabled. Set SCHEDULE_ENABLED=true to enable.");
    return;
  }

  console.log("[Scheduler] Initializing scheduled tasks...");

  // Stop any existing tasks
  scheduledTasks.forEach((task) => task.stop());
  scheduledTasks = [];

  // Get trigger times from database
  const { time1, time2 } = await getTriggerTimes();
  const cron1 = timeToCron(time1);
  const cron2 = timeToCron(time2);

  // Schedule first trigger time (e.g., 5:10 PM GMT+7)
  const task1 = cron.schedule(
    cron1,
    async () => {
      console.log(`[Scheduler] Running ${time1} GMT+7 scheduled task...`);

      // Check if scheduler is enabled in database
      const isEnabled = await getSchedulerEnabled();
      if (!isEnabled) {
        console.log("[Scheduler] Task skipped - scheduler is disabled in database");
        return;
      }

      await sendScheduledSlackMessage(time1, "evening");
    },
    {
      timezone: "Asia/Bangkok", // GMT+7
    }
  );

  // Schedule second trigger time (e.g., 10:40 PM GMT+7)
  const task2 = cron.schedule(
    cron2,
    async () => {
      console.log(`[Scheduler] Running ${time2} GMT+7 scheduled task...`);

      // Check if scheduler is enabled in database
      const isEnabled = await getSchedulerEnabled();
      if (!isEnabled) {
        console.log("[Scheduler] Task skipped - scheduler is disabled in database");
        return;
      }

      await sendScheduledSlackMessage(time2, "night");
    },
    {
      timezone: "Asia/Bangkok", // GMT+7
    }
  );

  // Schedule comment checker - runs every minute to check for scheduled comments
  const commentTask = cron.schedule(
    "* * * * *", // Every minute
    async () => {
      // Check if scheduler is enabled in database
      const isEnabled = await getSchedulerEnabled();
      if (!isEnabled) {
        return;
      }

      await checkAndPostScheduledComments();
    },
    {
      timezone: "Asia/Bangkok", // GMT+7
    }
  );

  scheduledTasks.push(task1, task2, commentTask);

  console.log("[Scheduler] Scheduled tasks initialized:");
  console.log(`  - Daily at ${time1} GMT+7 (Asia/Bangkok) - cron: ${cron1}`);
  console.log(`  - Daily at ${time2} GMT+7 (Asia/Bangkok) - cron: ${cron2}`);
  console.log("  - Scheduled comments checker every minute");
  console.log("  - Tasks will check database state before running");
}

async function sendScheduledSlackMessage(timeLabel: string, shift: "evening" | "night") {
  try {
    // Check if token exists for this shift
    const token = shift === "evening"
      ? await getEveningUserToken()
      : await getNightUserToken();

    if (!token) {
      console.log(`[Scheduler] Skipping ${shift} shift (${timeLabel}) - no user token configured`);
      return;
    }

    console.log(`[Scheduler] Triggering ${shift} shift (${timeLabel}) with configured user token`);

    const response = await axios.post(
      `${APP_URL}/api/scheduled-slack`,
      { shift }, // Pass shift type to API
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    console.log(`[Scheduler] ${timeLabel} task completed successfully:`, response.data);

    // After sending handover message, check for any recent handover messages that need replies
    await checkAndReplyToHandoverMessages();
  } catch (error: any) {
    console.error(`[Scheduler] ${timeLabel} task failed:`, error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
  }
}

// Check for recent handover messages and reply if they don't have replies yet
async function checkAndReplyToHandoverMessages() {
  try {
    console.log(`[Scheduler] Checking for handover messages that need replies...`);

    // Check if there are any enabled scheduled comments
    const scheduledComments = await getEnabledScheduledComments();
    const slackComments = scheduledComments.filter(c => c.comment_type === 'slack');

    if (slackComments.length === 0) {
      console.log(`[Scheduler] No scheduled Slack comments configured`);
      return;
    }

    // Call the API to scan and reply to handover messages
    const response = await axios.post(
      `${APP_URL}/api/scan-and-reply-handover`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    console.log(`[Scheduler] Scan and reply result:`, response.data);
  } catch (error: any) {
    console.error("[Scheduler] Error checking handover messages:", error.message);
  }
}

export function stopScheduler() {
  console.log("[Scheduler] Stopping all scheduled tasks...");
  scheduledTasks.forEach((task) => task.stop());
  scheduledTasks = [];
}

// Check and post scheduled comments based on their cron schedules
// Note: Only handles Jira comments. Slack thread comments are posted after handover messages.
async function checkAndPostScheduledComments() {
  try {
    const scheduledComments = await getEnabledScheduledComments();

    // Filter for Jira comments only (Slack comments are posted after handover)
    const jiraComments = scheduledComments.filter(c => c.comment_type === 'jira');

    if (jiraComments.length === 0) {
      return;
    }

    const now = new Date();

    for (const comment of jiraComments) {
      try {
        // Parse the cron schedule to check if it should run now
        const task = cron.schedule(comment.cron_schedule, () => {});

        // Check if the schedule matches the current time
        const shouldRun = await shouldRunCronNow(comment.cron_schedule, comment.last_posted_at, now);

        if (shouldRun) {
          console.log(`[Scheduler] Posting scheduled comment ${comment.id} to ${comment.ticket_key}`);

          // Post the comment to Jira
          await axios.post(
            `${APP_URL}/api/post-jira-comment`,
            {
              ticket_key: comment.ticket_key,
              comment_text: comment.comment_text,
              scheduled_comment_id: comment.id,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              timeout: 30000,
            }
          );

          console.log(`[Scheduler] Successfully posted comment ${comment.id} to ${comment.ticket_key}`);
        }

        task.stop();
      } catch (error: any) {
        console.error(`[Scheduler] Failed to post comment ${comment.id}:`, error.message);
      }
    }
  } catch (error: any) {
    console.error("[Scheduler] Error checking scheduled comments:", error.message);
  }
}

// Helper function to determine if a cron schedule should run now
async function shouldRunCronNow(
  cronSchedule: string,
  lastPostedAt: Date | null | undefined,
  now: Date
): Promise<boolean> {
  try {
    // If never posted, check if the cron matches current time
    if (!lastPostedAt) {
      return isCronMatchingNow(cronSchedule, now);
    }

    // Check if enough time has passed based on the cron schedule
    const lastPosted = new Date(lastPostedAt);
    const timeDiff = now.getTime() - lastPosted.getTime();

    // Must be at least 1 minute since last post
    if (timeDiff < 60000) {
      return false;
    }

    // Check if cron schedule matches current time
    return isCronMatchingNow(cronSchedule, now);
  } catch (error) {
    console.error("Error checking cron schedule:", error);
    return false;
  }
}

// Check if a cron expression matches the current time
function isCronMatchingNow(cronSchedule: string, now: Date): boolean {
  try {
    const parts = cronSchedule.trim().split(/\s+/);
    if (parts.length !== 5) {
      return false; // Invalid cron format
    }

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    const currentMinute = now.getMinutes();
    const currentHour = now.getHours();
    const currentDayOfMonth = now.getDate();
    const currentMonth = now.getMonth() + 1; // JS months are 0-indexed
    const currentDayOfWeek = now.getDay(); // 0 = Sunday

    // Check minute
    if (minute !== "*" && !matchesCronPart(minute, currentMinute, 0, 59)) {
      return false;
    }

    // Check hour
    if (hour !== "*" && !matchesCronPart(hour, currentHour, 0, 23)) {
      return false;
    }

    // Check day of month
    if (dayOfMonth !== "*" && !matchesCronPart(dayOfMonth, currentDayOfMonth, 1, 31)) {
      return false;
    }

    // Check month
    if (month !== "*" && !matchesCronPart(month, currentMonth, 1, 12)) {
      return false;
    }

    // Check day of week
    if (dayOfWeek !== "*" && !matchesCronPart(dayOfWeek, currentDayOfWeek, 0, 6)) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error parsing cron schedule:", error);
    return false;
  }
}

// Match a single cron part (handles *, numbers, ranges, lists, steps)
function matchesCronPart(cronPart: string, currentValue: number, min: number, max: number): boolean {
  if (cronPart === "*") {
    return true;
  }

  // Handle step values (e.g., */5)
  if (cronPart.includes("/")) {
    const [range, step] = cronPart.split("/");
    const stepNum = parseInt(step);
    if (range === "*") {
      return currentValue % stepNum === 0;
    }
  }

  // Handle ranges (e.g., 1-5)
  if (cronPart.includes("-")) {
    const [start, end] = cronPart.split("-").map(Number);
    return currentValue >= start && currentValue <= end;
  }

  // Handle lists (e.g., 1,3,5)
  if (cronPart.includes(",")) {
    const values = cronPart.split(",").map(Number);
    return values.includes(currentValue);
  }

  // Handle single number
  return parseInt(cronPart) === currentValue;
}

// Export for manual testing - triggers both shifts
export async function triggerScheduledTask() {
  console.log("[Scheduler] Manually triggering scheduled tasks for both shifts...");
  await sendScheduledSlackMessage("Manual Trigger - Evening", "evening");
  await sendScheduledSlackMessage("Manual Trigger - Night", "night");
}
