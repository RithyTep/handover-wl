import { z } from "zod";

export const schedulerStateSchema = z.object({
  enabled: z.boolean(),
});

export const triggerTimesSchema = z.object({
  time1: z.string(),
  time2: z.string(),
});

export const customChannelSchema = z.object({
  channel_id: z.string(),
});

export const memberMentionsSchema = z.object({
  mentions: z.string(),
});

export const shiftTokensSchema = z.object({
  evening_user_token: z.string(),
  night_user_token: z.string(),
  evening_mentions: z.string(),
  night_mentions: z.string(),
});
