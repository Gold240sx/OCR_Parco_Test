"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export const queries = [
	"name",
	"netTakeHome",
	"alotSaving",
	"tspContribution",
	"healthInsurancePremium",
	"currentLeaveBalance",
	"currentSickLeaveBalance",
	"fdvv",
	"fdvd",
	"medicalBeforeTax",
	"medicalEmployer",
	"dentalVision",
	"dentalBeforeTax",
	"dentalEmployer",
	"coreLife",
	"lifteInsuranceTotal",
	"suppLife",
	"_401k",
	"_401kAfterTax",
	"disability",
	"federalCampaign",
	"baseSalary",
	"dateOfHire",
	"payPeriod",
	"payPeriodStart",
	"payPeriodEnd",
	"payPlanGradeStep",
	"payPlan",
	"payGrade",
	"payStep",
	"oasdi",
	"retirement",
	"fsa",
	"rate",
	"fehb",
	"fedMedEE",
	"fedMedRR",
	"withholding",
]

const MockAPI = () => {
	const [showTestApiInstruct, setShowTestApiInstruct] = useState(true)

	const handleSubmitQueries = async () => {
		try {
			let fetches = 0
			let responses = []
			let undefinedCount = 0

			// Collect all API responses
			for (let i = 0; i < queries.length; i += 15) {
				const response = await fetch(
					`/api/mock_api?item=${queries.slice(i, i + 15).join(",")}`
				)
				const data = await response.json()
				fetches++
				console.log({
					fetchNumber: fetches,
					data: data.data,
					undefinedValues: data.undefinedCount,
				})
				if (data.undefinedCount > 0) {
					undefinedCount += data.undefinedCount
				}
				responses.push(data.data)
			}

			// Call the unify-responses API
			const unifyResponse = await fetch(
				`/api/mock_api?responses=${JSON.stringify(
					responses
				)}&totalUndefined=${undefinedCount}`
			)
			const unifiedResponse = await unifyResponse.json()

			if ("error" in unifiedResponse && unifiedResponse.error) {
				toast.error("Error: " + unifiedResponse.error)
			} else if ("data" in unifiedResponse && unifiedResponse.data) {
				const definedValues = Object.values(
					unifiedResponse.data
				).filter((v) => v !== undefined)

				console.log("SUMMARY", {
					totalFetchedItems: queries.length,
					amount: definedValues.length,
					undefinedAmount: unifiedResponse.undefinedCount,
					data: unifiedResponse.data,
				})
				toast.success(
					"Complete Success: " +
						definedValues.length +
						" values received (" +
						unifiedResponse.undefinedCount +
						" undefined)"
				)
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error("Error fetching data: " + error.message)
			} else {
				toast.error("An unknown error occurred")
			}
		}
	}

	return (
		<>
			<div className="relative min-h-24">
				<Button
					onClick={() => {
						setShowTestApiInstruct(!showTestApiInstruct)
					}}
					className="bg-black/50 text-xl z-10 hover:bg-black cursor-pointer !px-4 !py-2 absolute top-4 right-6 rounded-xl">
					Minimize Instructions
				</Button>
				<div
					className={`${
						showTestApiInstruct ? "h-fit p-4" : "h-0 p-0"
					} bg-gray-800 relative rounded-xl ease-in-out duration-300 transition-all text-white`}>
					<code
						className={`text-sm block ${
							showTestApiInstruct ? "" : "hidden"
						}`}>
						{queries.map((query, index) => (
							<p key={index} className={`my-1`}>
								{query}
								{query === "fdvv" ? (
									<>
										<span
											className={`${
												showTestApiInstruct
													? "block"
													: "hidden"
											} text-red-500 pl-2`}>
											// This value will not be returned
											to simulate a failed response
										</span>
										,
									</>
								) : (
									","
								)}
							</p>
						))}
					</code>
				</div>
				<Button
					onClick={handleSubmitQueries}
					className="bg-black mt-4 text-xl z-10 hover:bg-zinc-800 cursor-pointer !px-4 !py-2 rounded-xl">
					Submit Queries
				</Button>
			</div>
		</>
	)
}

export default MockAPI
