import { router, publicProcedure, protectedMutation } from "@/server/trpc/server";
import { SettingsService } from "@/server/services/settings.service";
import { schedulerStateSchema, triggerTimesSchema } from "@/schemas/settings.schema";
import { triggerScheduledTask } from "@/lib/scheduler";

const settingsService = new SettingsService();

export const schedulerRouter = router({
  getState: publicProcedure.query(async () => {
    const enabled = await settingsService.getSchedulerEnabled();
    return { enabled };
  }),

  setState: protectedMutation
    .input(schedulerStateSchema)
    .mutation(async ({ input }) => {
      await settingsService.setSchedulerEnabled(input.enabled);
      return { success: true, enabled: input.enabled };
    }),

  getTriggerTimes: publicProcedure.query(async () => {
    const times = await settingsService.getTriggerTimes();
    return times;
  }),

  setTriggerTimes: protectedMutation
    .input(triggerTimesSchema)
    .mutation(async ({ input }) => {
      await settingsService.setTriggerTimes(input.time1, input.time2);
      return { success: true };
    }),

  triggerSchedule: protectedMutation.mutation(async () => {
    await triggerScheduledTask();
    return { success: true };
  }),
});
