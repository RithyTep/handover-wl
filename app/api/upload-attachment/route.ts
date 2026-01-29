import { NextRequest, NextResponse } from "next/server"
import { uploadAttachment } from "@/lib/services"

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData()
		const ticketKey = formData.get("ticket_key") as string
		const file = formData.get("file") as File | null

		if (!ticketKey || !file) {
			return NextResponse.json(
				{ success: false, error: "Missing required fields: ticket_key, file" },
				{ status: 400 }
			)
		}

		const buffer = Buffer.from(await file.arrayBuffer())
		const result = await uploadAttachment(
			ticketKey,
			buffer,
			file.name,
			file.type
		)

		if (!result) {
			return NextResponse.json(
				{ success: false, error: `Failed to upload attachment to ${ticketKey}` },
				{ status: 500 }
			)
		}

		return NextResponse.json({
			success: true,
			filename: result.filename,
			mimeType: result.mimeType,
		})
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error"
		return NextResponse.json(
			{ success: false, error: message },
			{ status: 500 }
		)
	}
}
