import { router } from "./server";
import { themeRouter } from "./routers/theme";
import { ticketsRouter } from "./routers/tickets";
import { ticketDataRouter } from "./routers/ticketData";
import { slackRouter } from "./routers/slack";
import { aiRouter } from "./routers/ai";
import { schedulerRouter } from "./routers/scheduler";
import { backupRouter } from "./routers/backup";
import { feedbackRouter } from "./routers/feedback";
import { settingsRouter } from "./routers/settings";
import { scheduledCommentsRouter } from "./routers/scheduledComments";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  theme: themeRouter,
  tickets: ticketsRouter,
  ticketData: ticketDataRouter,
  slack: slackRouter,
  ai: aiRouter,
  scheduler: schedulerRouter,
  backup: backupRouter,
  feedback: feedbackRouter,
  settings: settingsRouter,
  scheduledComments: scheduledCommentsRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
