import { NextRequest, NextResponse } from "next/server"
import { fetchAttachmentContent } from "@/lib/services"

export async function GET(req: NextRequest) {
	const id = req.nextUrl.searchParams.get("id")
	const type = req.nextUrl.searchParams.get("type") as
		| "content"
		| "thumbnail"
		| null

	if (!id) {
		return NextResponse.json(
			{ success: false, error: "Missing required query param: id" },
			{ status: 400 }
		)
	}

	try {
		const result = await fetchAttachmentContent(
			id,
			type === "thumbnail" ? "thumbnail" : "content"
		)

		if (!result) {
			return NextResponse.json(
				{ success: false, error: "Attachment not found" },
				{ status: 404 }
			)
		}

		return new NextResponse(new Uint8Array(result.data), {
			headers: {
				"Content-Type": result.contentType,
				"Cache-Control": "public, max-age=86400",
			},
		})
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error"
		return NextResponse.json(
			{ success: false, error: message },
			{ status: 500 }
		)
	}
}
