import * as cron from "node-cron";
import axios from "axios";
import { getSchedulerEnabled } from "./db";

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const SCHEDULE_ENABLED = process.env.SCHEDULE_ENABLED === "true";

let scheduledTasks: cron.ScheduledTask[] = [];

export function initScheduler() {
  if (!SCHEDULE_ENABLED) {
    console.log("[Scheduler] Scheduling is disabled. Set SCHEDULE_ENABLED=true to enable.");
    return;
  }

  console.log("[Scheduler] Initializing scheduled tasks...");

  // Stop any existing tasks
  scheduledTasks.forEach((task) => task.stop());
  scheduledTasks = [];

  // Schedule 5:16 PM GMT+7 (17:16 Bangkok time)
  const task1 = cron.schedule(
    "16 17 * * *", // At 17:16 (5:16 PM) every day
    async () => {
      console.log("[Scheduler] Running 5:16 PM GMT+7 scheduled task...");

      // Check if scheduler is enabled in database
      const isEnabled = await getSchedulerEnabled();
      if (!isEnabled) {
        console.log("[Scheduler] Task skipped - scheduler is disabled in database");
        return;
      }

      await sendScheduledSlackMessage("5:16 PM");
    },
    {
      timezone: "Asia/Bangkok", // GMT+7
    }
  );

  // Schedule 11:46 PM GMT+7 (23:46 Bangkok time)
  const task2 = cron.schedule(
    "46 23 * * *", // At 23:46 (11:46 PM) every day
    async () => {
      console.log("[Scheduler] Running 11:46 PM GMT+7 scheduled task...");

      // Check if scheduler is enabled in database
      const isEnabled = await getSchedulerEnabled();
      if (!isEnabled) {
        console.log("[Scheduler] Task skipped - scheduler is disabled in database");
        return;
      }

      await sendScheduledSlackMessage("11:46 PM");
    },
    {
      timezone: "Asia/Bangkok", // GMT+7
    }
  );

  scheduledTasks.push(task1, task2);

  console.log("[Scheduler] Scheduled tasks initialized:");
  console.log("  - Daily at 5:16 PM GMT+7 (Asia/Bangkok)");
  console.log("  - Daily at 11:46 PM GMT+7 (Asia/Bangkok)");
  console.log("  - Tasks will check database state before running");
}

async function sendScheduledSlackMessage(timeLabel: string) {
  try {
    const response = await axios.post(
      `${APP_URL}/api/scheduled-slack`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    console.log(`[Scheduler] ${timeLabel} task completed successfully:`, response.data);
  } catch (error: any) {
    console.error(`[Scheduler] ${timeLabel} task failed:`, error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
  }
}

export function stopScheduler() {
  console.log("[Scheduler] Stopping all scheduled tasks...");
  scheduledTasks.forEach((task) => task.stop());
  scheduledTasks = [];
}

// Export for manual testing
export async function triggerScheduledTask() {
  console.log("[Scheduler] Manually triggering scheduled task...");
  await sendScheduledSlackMessage("Manual Trigger");
}
