import { NextRequest, NextResponse } from "next/server"
import { fetchTicketComments } from "@/lib/services"

export async function GET(req: NextRequest) {
	const key = req.nextUrl.searchParams.get("key")

	if (!key) {
		return NextResponse.json(
			{ success: false, error: "Missing required query param: key" },
			{ status: 400 }
		)
	}

	try {
		const comments = await fetchTicketComments(key)
		return NextResponse.json({ success: true, comments })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error"
		return NextResponse.json(
			{ success: false, error: message },
			{ status: 500 }
		)
	}
}
