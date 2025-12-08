import { z } from "zod"

export const ticketDataRecordSchema = z.object({
	status: z.string(),
	action: z.string(),
})

export const ticketDataSaveSchema = z.record(z.string(), ticketDataRecordSchema)

export type TicketDataRecord = z.infer<typeof ticketDataRecordSchema>
export type TicketDataSaveRequest = z.infer<typeof ticketDataSaveSchema>
