const accountOptions = ["edward jones", "ameritrade", "carol swhab"]
const agencyOptions = ["USDA", "GSA", "DOE", "DOD", "TVA", "USPS"]
const documentOptions = ["voidedCheck", "bankStatement", "paystub"]

type FileDocRenameType = {
	documentType: (typeof documentOptions)[number]
	accountStatement: (typeof accountOptions)[number]
}

type AccountType = (typeof accountOptions)[number]
type AgencyType = (typeof agencyOptions)[number]
type DocumentType = (typeof documentOptions)[number]

export enum Agency {
	USDA = "USDA",
	DOD = "DOD",
	// Add other agencies as needed
}

export { accountOptions, agencyOptions, documentOptions }
export type { FileDocRenameType, AccountType, AgencyType, DocumentType }
