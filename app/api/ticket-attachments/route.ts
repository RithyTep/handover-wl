import { NextRequest, NextResponse } from "next/server"
import { fetchIssueAttachments } from "@/lib/services"

export async function GET(req: NextRequest) {
	const key = req.nextUrl.searchParams.get("key")

	if (!key) {
		return NextResponse.json(
			{ success: false, error: "Missing required query param: key" },
			{ status: 400 }
		)
	}

	try {
		const attachments = await fetchIssueAttachments(key)
		return NextResponse.json({ success: true, attachments })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error"
		return NextResponse.json(
			{ success: false, error: message },
			{ status: 500 }
		)
	}
}
