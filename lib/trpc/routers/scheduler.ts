import { router, publicProcedure } from "@/server/trpc/server";
import { SettingsService } from "@/server/services/settings.service";
import { schedulerStateSchema, triggerTimesSchema } from "@/schemas/settings.schema";
import { triggerScheduledTask } from "@/lib/scheduler";

const settingsService = new SettingsService();

export const schedulerRouter = router({
  getState: publicProcedure.query(async () => {
    const enabled = await settingsService.getSchedulerEnabled();
    return { enabled };
  }),

  setState: publicProcedure
    .input(schedulerStateSchema)
    .mutation(async ({ input }) => {
      await settingsService.setSchedulerEnabled(input.enabled);
      return { success: true, enabled: input.enabled };
    }),

  getTriggerTimes: publicProcedure.query(async () => {
    const times = await settingsService.getTriggerTimes();
    return times;
  }),

  setTriggerTimes: publicProcedure
    .input(triggerTimesSchema)
    .mutation(async ({ input }) => {
      await settingsService.setTriggerTimes(input.time1, input.time2);
      return { success: true };
    }),

  triggerSchedule: publicProcedure.mutation(async () => {
    await triggerScheduledTask();
    return { success: true };
  }),
});
