import { z } from "zod";
import { router, publicProcedure } from "../server";
import { getSchedulerEnabled, setSchedulerEnabled, getTriggerTimes, setTriggerTimes } from "@/lib/services";
import { triggerScheduledTask } from "@/lib/scheduler";

export const schedulerRouter = router({
  getState: publicProcedure.query(async () => {
    const enabled = await getSchedulerEnabled();
    return { enabled };
  }),

  setState: publicProcedure
    .input(
      z.object({
        enabled: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      await setSchedulerEnabled(input.enabled);
      return { success: true, enabled: input.enabled };
    }),

  getTriggerTimes: publicProcedure.query(async () => {
    const times = await getTriggerTimes();
    return times;
  }),

  setTriggerTimes: publicProcedure
    .input(
      z.object({
        time1: z.string(),
        time2: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await setTriggerTimes(input.time1, input.time2);
      return { success: true };
    }),

  triggerSchedule: publicProcedure.mutation(async () => {
    await triggerScheduledTask();
    return { success: true };
  }),
});
