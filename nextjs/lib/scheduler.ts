import * as cron from "node-cron";
import axios from "axios";

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

  // Schedule 5:00 PM GMT+7 (17:00 Bangkok time)
  const task1 = cron.schedule(
    "0 17 * * *", // At 17:00 (5:00 PM) every day
    async () => {
      console.log("[Scheduler] Running 5:00 PM GMT+7 scheduled task...");
      await sendScheduledSlackMessage("5:00 PM");
    },
    {
      timezone: "Asia/Bangkok", // GMT+7
    }
  );

  // Schedule 11:30 PM GMT+7 (23:30 Bangkok time)
  const task2 = cron.schedule(
    "30 23 * * *", // At 23:30 (11:30 PM) every day
    async () => {
      console.log("[Scheduler] Running 11:30 PM GMT+7 scheduled task...");
      await sendScheduledSlackMessage("11:30 PM");
    },
    {
      timezone: "Asia/Bangkok", // GMT+7
    }
  );

  scheduledTasks.push(task1, task2);

  console.log("[Scheduler] Scheduled tasks initialized:");
  console.log("  - Daily at 5:00 PM GMT+7 (Asia/Bangkok)");
  console.log("  - Daily at 11:30 PM GMT+7 (Asia/Bangkok)");
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
