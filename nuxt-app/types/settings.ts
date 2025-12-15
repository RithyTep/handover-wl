import { z } from 'zod'

export const schedulerStateSchema = z.object({
  enabled: z.boolean(),
})

export const triggerTimesSchema = z.object({
  time1: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  time2: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
})

export const customChannelSchema = z.object({
  channel_id: z.string().min(1, 'Channel ID is required'),
})

export const memberMentionsSchema = z.object({
  mentions: z.string(),
})

export const shiftTokensSchema = z.object({
  evening_user_token: z.string(),
  night_user_token: z.string(),
  evening_mentions: z.string(),
  night_mentions: z.string(),
})

export type SchedulerStateRequest = z.infer<typeof schedulerStateSchema>
export type TriggerTimesRequest = z.infer<typeof triggerTimesSchema>
export type CustomChannelRequest = z.infer<typeof customChannelSchema>
export type MemberMentionsRequest = z.infer<typeof memberMentionsSchema>
export type ShiftTokensRequest = z.infer<typeof shiftTokensSchema>
