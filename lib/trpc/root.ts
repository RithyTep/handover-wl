import { router } from "./server";
import { themeRouter } from "@/server/trpc/routers/theme.router";
import { ticketsRouter } from "./routers/tickets";
import { ticketDataRouter } from "./routers/ticketData";
import { slackRouter } from "./routers/slack";
import { aiRouter } from "./routers/ai";
import { schedulerRouter } from "./routers/scheduler";
import { backupRouter } from "./routers/backup";
import { feedbackRouter } from "./routers/feedback";
import { settingsRouter } from "./routers/settings";
import { scheduledCommentsRouter } from "./routers/scheduledComments";

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

export type AppRouter = typeof appRouter;
