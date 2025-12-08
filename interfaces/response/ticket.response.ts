import type { ITicket, ITicketData } from "../common/ticket.interface"

export interface IGetTicketsResponse {
	tickets: ITicket[]
}

export interface IGetTicketDataResponse {
	ticketData: Record<string, ITicketData>
}

export interface ISaveTicketDataResponse {
	saved: number
}
