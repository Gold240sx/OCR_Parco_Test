import OpenAI from "openai"
import {
	type FileDocRenameType,
	type AccountType,
	type AgencyType,
	type DocumentType,
	accountOptions,
	agencyOptions,
	documentOptions,
} from "@/types/FileTypes"

type AIConfig = {
	role: string
	content: string
	name?: string
}

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
})

const AIGlobalConfig = {
	model: "gpt-4",
}

const AISystemConfig: AIConfig = {
	role: "system",
	content: `You are a helpful assistant that extracts titles from documents and identifies their source. 
	Please respond in JSON format with the following structure:
	{
		"documentType": "string",
		"AccountType": "string",
		"AgencyType": "string"
	}
	
	The documentType should be one of: ${documentOptions}
	The AccountType should be one of: ${accountOptions}
	The AgencyType should be one of: ${agencyOptions}
	
	If the document is a voided check or bank statement, the source is "bank".
	If the document is a paystub, the source is "employer".
	Match the titles to the closest available option in the provided arrays.`,
}

const AIUserConfig: AIConfig = {
	role: "user",
	content: `Here is the document content:`,
}

export const getDocumentTitleAndSource = async (document: FileList | File) => {
	if (!document) {
		throw new Error("No document provided")
	}
	if (!openai) {
		throw new Error("OpenAI not initialized correctly. Check your API key.")
	}
	try {
		const response = await openai.chat.completions.create({
			model: AIGlobalConfig.model,
			messages: [
				{ role: "system", content: AISystemConfig.content },
				{ role: "user", content: AIUserConfig.content },
			],
		})
		const result = response.choices[0]?.message?.content?.trim() ?? ""

		if (!result || result === "") {
			throw new Error("No response from AI")
		}
		console.log(result)
		return result
	} catch (error) {
		console.error(error)
		throw new Error("Could not fetch title and source from OpenAI.")
	}
}
