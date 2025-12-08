import type { IThemeInfo, IThemeState } from "../common/theme.interface"

export interface IGetThemeResponse {
	theme: IThemeState
}

export interface IGetThemeListResponse {
	themes: IThemeInfo[]
}

export interface ISetThemeResponse {
	theme: IThemeState
}
