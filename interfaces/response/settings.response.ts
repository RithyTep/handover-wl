export interface ISchedulerState {
	enabled: boolean
}

export interface ITriggerTimes {
	time1: string
	time2: string
}

export interface ICustomChannel {
	channel_id: string
}

export interface IMemberMentions {
	mentions: string
}

export interface IShiftTokens {
	evening_user_token: string
	night_user_token: string
	evening_mentions: string
	night_mentions: string
}

export interface IGetSettingsResponse {
	scheduler: ISchedulerState
	triggerTimes: ITriggerTimes
	customChannel: ICustomChannel
	memberMentions: IMemberMentions
	shiftTokens: IShiftTokens
}
