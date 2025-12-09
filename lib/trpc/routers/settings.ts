import { router, publicProcedure, protectedMutation } from "@/server/trpc/server";
import { SettingsService } from "@/server/services/settings.service";
import { customChannelSchema, memberMentionsSchema, shiftTokensSchema } from "@/schemas/settings.schema";

const settingsService = new SettingsService();

export const settingsRouter = router({
  getCustomChannel: publicProcedure.query(async () => {
    const channelId = await settingsService.getCustomChannelId();
    return { success: true, channelId };
  }),

  setCustomChannel: protectedMutation
    .input(customChannelSchema)
    .mutation(async ({ input }) => {
      await settingsService.setCustomChannelId(input.channel_id);
      return { success: true, channelId: input.channel_id };
    }),

  getShiftTokens: publicProcedure.query(async () => {
    const eveningToken = await settingsService.getEveningUserToken();
    const nightToken = await settingsService.getNightUserToken();
    const eveningMentions = await settingsService.getEveningMentions();
    const nightMentions = await settingsService.getNightMentions();

    return {
      success: true,
      data: {
        eveningToken: eveningToken || "",
        nightToken: nightToken || "",
        eveningMentions: eveningMentions || "",
        nightMentions: nightMentions || "",
      },
    };
  }),

  setShiftTokens: protectedMutation
    .input(shiftTokensSchema)
    .mutation(async ({ input }) => {
      if (input.evening_user_token) {
        await settingsService.setEveningUserToken(input.evening_user_token);
      }
      if (input.night_user_token) {
        await settingsService.setNightUserToken(input.night_user_token);
      }
      if (input.evening_mentions) {
        await settingsService.setEveningMentions(input.evening_mentions);
      }
      if (input.night_mentions) {
        await settingsService.setNightMentions(input.night_mentions);
      }
      return { success: true };
    }),

  getMemberMentions: publicProcedure.query(async () => {
    const mentions = await settingsService.getMemberMentions();
    return { success: true, mentions: mentions || "" };
  }),

  setMemberMentions: protectedMutation
    .input(memberMentionsSchema)
    .mutation(async ({ input }) => {
      await settingsService.setMemberMentions(input.mentions);
      return { success: true, mentions: input.mentions };
    }),
});
