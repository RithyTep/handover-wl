export interface IUpdateSchedulerStateRequest {
	enabled: boolean
}

export interface IUpdateTriggerTimesRequest {
	time1: string
	time2: string
}

export interface IUpdateCustomChannelRequest {
	channel_id: string
}

export interface IUpdateMemberMentionsRequest {
	mentions: string
}

export interface IUpdateShiftTokensRequest {
	evening_user_token: string
	night_user_token: string
	evening_mentions: string
	night_mentions: string
}
