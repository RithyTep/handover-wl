import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { SCHEDULER } from "@/lib/config"
import { Theme } from "@/enums"
import { isValidTheme } from "@/lib/types"

const log = logger.db

export async function getSetting(key: string): Promise<string | null> {
	try {
		const setting = await prisma.appSetting.findUnique({ where: { key } })
		return setting?.value || null
	} catch {
		return null
	}
}

export async function setSetting(key: string, value: string): Promise<void> {
	await prisma.appSetting.upsert({
		where: { key },
		update: { value, updatedAt: new Date() },
		create: { key, value },
	})
}

export async function getSchedulerEnabled(): Promise<boolean> {
	try {
		const setting = await prisma.appSetting.findUnique({
			where: { key: "scheduler_enabled" },
		})
		return setting?.value === "true"
	} catch {
		return true
	}
}

export async function setSchedulerEnabled(enabled: boolean): Promise<void> {
	log.info("Updating scheduler status", { enabled })
	await prisma.appSetting.upsert({
		where: { key: "scheduler_enabled" },
		update: { value: enabled.toString(), updatedAt: new Date() },
		create: { key: "scheduler_enabled", value: enabled.toString() },
	})
}

export async function getTriggerTimes(): Promise<{
	time1: string
	time2: string
}> {
	try {
		const settings = await prisma.appSetting.findMany({
			where: {
				key: { in: ["trigger_time_1", "trigger_time_2"] },
			},
		})
		const times: { time1: string; time2: string } = {
			time1: SCHEDULER.DEFAULT_TIME_1,
			time2: SCHEDULER.DEFAULT_TIME_2,
		}
		for (const setting of settings) {
			if (setting.key === "trigger_time_1") times.time1 = setting.value
			if (setting.key === "trigger_time_2") times.time2 = setting.value
		}
		return times
	} catch {
		return { time1: SCHEDULER.DEFAULT_TIME_1, time2: SCHEDULER.DEFAULT_TIME_2 }
	}
}

export async function setTriggerTimes(time1: string, time2: string): Promise<void> {
	log.info("Updating trigger times", { time1, time2 })
	await prisma.$transaction([
		prisma.appSetting.upsert({
			where: { key: "trigger_time_1" },
			update: { value: time1, updatedAt: new Date() },
			create: { key: "trigger_time_1", value: time1 },
		}),
		prisma.appSetting.upsert({
			where: { key: "trigger_time_2" },
			update: { value: time2, updatedAt: new Date() },
			create: { key: "trigger_time_2", value: time2 },
		}),
	])
}

export const getCustomChannelId = () => getSetting("custom_channel_id")
export const setCustomChannelId = (v: string) => setSetting("custom_channel_id", v)

export const getMemberMentions = () => getSetting("member_mentions")
export const setMemberMentions = (v: string) => setSetting("member_mentions", v)

export const getEveningUserToken = () => getSetting("evening_user_token")
export const setEveningUserToken = (v: string) => setSetting("evening_user_token", v)

export const getNightUserToken = () => getSetting("night_user_token")
export const setNightUserToken = (v: string) => setSetting("night_user_token", v)

export const getEveningMentions = () => getSetting("evening_mentions")
export const setEveningMentions = (v: string) => setSetting("evening_mentions", v)

export const getNightMentions = () => getSetting("night_mentions")
export const setNightMentions = (v: string) => setSetting("night_mentions", v)

export const getThemePreference = async (): Promise<Theme> => {
	const theme = await getSetting("theme_preference")
	if (theme && isValidTheme(theme)) {
		return theme
	}
	return Theme.DEFAULT
}

export const setThemePreference = async (theme: Theme): Promise<void> => {
	await setSetting("theme_preference", theme)
}
