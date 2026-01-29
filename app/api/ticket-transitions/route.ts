import { NextRequest, NextResponse } from "next/server"
import { fetchTransitions } from "@/lib/services"

export async function GET(req: NextRequest) {
	const key = req.nextUrl.searchParams.get("key")

	if (!key) {
		return NextResponse.json(
			{ success: false, error: "Missing required query param: key" },
			{ status: 400 }
		)
	}

	try {
		const transitions = await fetchTransitions(key)
		return NextResponse.json({ success: true, transitions })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error"
		return NextResponse.json(
			{ success: false, error: message },
			{ status: 500 }
		)
	}
}
