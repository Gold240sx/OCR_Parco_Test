import { getDocumentTitleAndSource } from "@/context/open_ai/openAiContext"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
	try {
		const contentType = request.headers.get("content-type")
		if (!contentType || !contentType.includes("multipart/form-data")) {
			return NextResponse.json(
				{ error: "Invalid content type. Expected multipart/form-data" },
				{ status: 400 }
			)
		}

		const formData = await request.formData()
		const document = formData.get("document")
		if (!document || !(document instanceof File)) {
			return NextResponse.json(
				{ error: "Invalid document" },
				{ status: 400 }
			)
		}

		const result = await getDocumentTitleAndSource(document)

		// Parse the result string into an object
		const parsedResult = JSON.parse(result)

		return NextResponse.json({ result: parsedResult }, { status: 200 })
	} catch (error) {
		console.error("Error:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
