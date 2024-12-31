"use server"
// api/mock_api
import { NextResponse } from "next/server"

// This is a mock API that simulates a server response. it gives what is asked for but limits the responses
// Get Request that takes in the name of an array of items: strings and returns the item[name] from the responses object

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)

		// If responses parameter exists, unify the responses
		const responsesParam = searchParams.get("responses")
		if (responsesParam) {
			const parsedResponses = JSON.parse(responsesParam)
			const combinedData = parsedResponses.reduce(
				(acc: any, curr: any) => ({ ...acc, ...curr }),
				{}
			)
			// Get the total undefined count from the query parameter
			const totalUndefined = parseInt(
				searchParams.get("totalUndefined") || "0"
			)
			return NextResponse.json({
				data: combinedData,
				undefinedCount: totalUndefined,
			})
		}

		// Handle individual item requests
		const itemsParam = searchParams.get("item")
		if (itemsParam) {
			const requestedItems = itemsParam.split(",")
			const result: Record<string, string | undefined> = {}
			let undefinedCount = 0

			requestedItems.forEach((item) => {
				// const value =
				// 	item in responses
				// 		? responses[item as keyof typeof responses]
				// 		: undefined
				// result[item] = value
				// if (value === undefined) undefinedCount++
			})

			return NextResponse.json({ data: result, undefinedCount })
		}

		return NextResponse.json({ error: "No valid parameters provided" })
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
