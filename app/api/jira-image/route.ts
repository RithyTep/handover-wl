import { NextRequest, NextResponse } from "next/server"
import { fetchAttachmentContent, fetchJiraImageByUrl } from "@/lib/services"

export async function GET(req: NextRequest) {
	const id = req.nextUrl.searchParams.get("id")
	const url = req.nextUrl.searchParams.get("url")
	const type = req.nextUrl.searchParams.get("type") as
		| "content"
		| "thumbnail"
		| null

	if (!id && !url) {
		return NextResponse.json(
			{ success: false, error: "Missing required query param: id or url" },
			{ status: 400 }
		)
	}

	try {
		const result = url
			? await fetchJiraImageByUrl(url)
			: await fetchAttachmentContent(
					id!,
					type === "thumbnail" ? "thumbnail" : "content"
				)

		if (!result) {
			return NextResponse.json(
				{ success: false, error: "Image not found" },
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
