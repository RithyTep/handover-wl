import { z } from "zod";
import { router, publicProcedure } from "../server";
import { getSetting, setSetting } from "@/lib/services/database";

export const settingsRouter = router({
  getCustomChannel: publicProcedure.query(async () => {
    const channelId = await getSetting("custom_channel_id");
    return { success: true, channelId: channelId || null };
  }),

  setCustomChannel: publicProcedure
    .input(
      z.object({
        channelId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await setSetting("custom_channel_id", input.channelId);
      return { success: true, channelId: input.channelId };
    }),

  getShiftTokens: publicProcedure.query(async () => {
    const eveningToken = await getSetting("evening_token") || "";
    const nightToken = await getSetting("night_token") || "";
    const eveningMentions = await getSetting("evening_mentions") || "";
    const nightMentions = await getSetting("night_mentions") || "";

    return {
      success: true,
      data: {
        eveningToken,
        nightToken,
        eveningMentions,
        nightMentions,
      },
    };
  }),

  setShiftTokens: publicProcedure
    .input(
      z.object({
        eveningToken: z.string().optional(),
        nightToken: z.string().optional(),
        eveningMentions: z.string().optional(),
        nightMentions: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      if (input.eveningToken !== undefined) {
        await setSetting("evening_token", input.eveningToken);
      }
      if (input.nightToken !== undefined) {
        await setSetting("night_token", input.nightToken);
      }
      if (input.eveningMentions !== undefined) {
        await setSetting("evening_mentions", input.eveningMentions);
      }
      if (input.nightMentions !== undefined) {
        await setSetting("night_mentions", input.nightMentions);
      }
      return { success: true };
    }),

  getMemberMentions: publicProcedure.query(async () => {
    const mentions = await getSetting("member_mentions") || "";
    return { success: true, mentions };
  }),

  setMemberMentions: publicProcedure
    .input(
      z.object({
        mentions: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await setSetting("member_mentions", input.mentions);
      return { success: true, mentions: input.mentions };
    }),
});
