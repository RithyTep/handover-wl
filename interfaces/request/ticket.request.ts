import type { ITicketDataRecord } from "../common/backup.interface"

export interface ISaveTicketDataRequest {
	data: Record<string, ITicketDataRecord>
}
