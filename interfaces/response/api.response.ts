export interface IApiSuccessResponse<T = void> {
	success: true
	data: T
}

export interface IApiErrorResponse {
	success: false
	error: string
	code?: string
}

export type IApiResponse<T = void> = IApiSuccessResponse<T> | IApiErrorResponse

export interface IPaginatedResponse<T> {
	items: T[]
	total: number
	page: number
	pageSize: number
	hasMore: boolean
}
