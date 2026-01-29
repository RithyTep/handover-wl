import { NextRequest, NextResponse } from "next/server"
import { transitionIssue } from "@/lib/services"

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const { ticket_key, transition_id } = body

		if (!ticket_key || !transition_id) {
			return NextResponse.json(
				{ success: false, error: "Missing required fields: ticket_key, transition_id" },
				{ status: 400 }
			)
		}

		const success = await transitionIssue(ticket_key, transition_id)

		if (!success) {
			return NextResponse.json(
				{ success: false, error: `Failed to transition ${ticket_key}` },
				{ status: 500 }
			)
		}

		return NextResponse.json({
			success: true,
			message: `${ticket_key} transitioned successfully`,
		})
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error"
		return NextResponse.json(
			{ success: false, error: message },
			{ status: 500 }
		)
	}
}
