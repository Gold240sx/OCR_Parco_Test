import { z } from "zod"
import {
	usdaBasicSchema,
	usdaBenefitSchema,
	usdaEmployerSchema,
	usdaLeaveSchema,
	usdaCodesSchema,
	usdaDeductionSchema,
} from "./agencies/usdaSchema"
import {
	gsaBasicSchema,
	gsaBenefitSchema,
	gsaEmployerSchema,
	gsaLeaveSchema,
	gsaCodesSchema,
	gsaDeductionSchema,
} from "./agencies/gsaSchema"
import {
	doeBasicSchema,
	doeBenefitSchema,
	doeEmployerSchema,
	doeLeaveSchema,
	doeCodesSchema,
	doeDeductionSchema,
} from "./agencies/doeSchema"
import {
	dodBasicSchema,
	dodBenefitSchema,
	dodEmployerSchema,
	dodLeaveSchema,
	dodCodesSchema,
	dodDeductionSchema,
} from "./agencies/dodSchema"
import {
	tvaBasicSchema,
	tvaBenefitSchema,
	tvaEmployerSchema,
	tvaLeaveSchema,
	tvaCodesSchema,
	tvaDeductionSchema,
} from "./agencies/tvaSchema"
import {
	uspsBasicSchema,
	uspsBenefitSchema,
	uspsEmployerSchema,
	uspsLeaveSchema,
	uspsCodesSchema,
	uspsDeductionSchema,
} from "./agencies/uspsSchema"

// The union Schema works as a Schema of enum but for zod object Schemas rather than simple strings or numbers
// This allows us to run queries that not only meet the requirements of the master but for also each agency's subSchemas (basic, benefit, employer, codes, deduction)

/*
 *==================================================
 * MARK:		   					     AGENCY MASTER SCHEMAS
 *==================================================
 */

// USDA
const usdaMasterSchema = z.object({
	agency: z.literal("USDA"),
	basic: usdaBasicSchema,
	benefit: usdaBenefitSchema,
	employer: usdaEmployerSchema,
	leave: usdaLeaveSchema,
	codes: usdaCodesSchema,
	deduction: usdaDeductionSchema,
})

// GSA
const gsaMasterSchema = z.object({
	agency: z.literal("GSA"),
	basic: gsaBasicSchema,
	benefit: gsaBenefitSchema,
	employer: gsaEmployerSchema,
	leave: gsaLeaveSchema,
	codes: gsaCodesSchema,
	deduction: gsaDeductionSchema,
})

// DOE
const doeMasterSchema = z.object({
	agency: z.literal("DOE"),
	basic: doeBasicSchema,
	benefit: doeBenefitSchema,
	employer: doeEmployerSchema,
	leave: doeLeaveSchema,
	codes: doeCodesSchema,
	deduction: doeDeductionSchema,
})

// DOD
const dodMasterSchema = z.object({
	agency: z.literal("DOD"),
	basic: dodBasicSchema,
	benefit: dodBenefitSchema,
	employer: dodEmployerSchema,
	leave: dodLeaveSchema,
	codes: dodCodesSchema,
	deduction: dodDeductionSchema,
})

// TVA
const tvaMasterSchema = z.object({
	agency: z.literal("TVA"),
	basic: tvaBasicSchema,
	benefit: tvaBenefitSchema,
	employer: tvaEmployerSchema,
	leave: tvaLeaveSchema,
	codes: tvaCodesSchema,
	deduction: tvaDeductionSchema,
})

// USPS
const uspsMasterSchema = z.object({
	agency: z.literal("USPS"),
	basic: uspsBasicSchema,
	benefit: uspsBenefitSchema,
	employer: uspsEmployerSchema,
	leave: uspsLeaveSchema,
	codes: uspsCodesSchema,
	deduction: uspsDeductionSchema,
})

/*
 *==================================================
 * MARK:		   					         MASTER SCHEMA
 *==================================================
 */

/* Basic Schema */
const basicSchema = z.union([
	usdaBasicSchema,
	gsaBasicSchema,
	doeBasicSchema,
	dodBasicSchema,
	tvaBasicSchema,
	uspsBasicSchema,
])

/* Benefit Schema */
const benefitSchema = z.union([
	usdaBenefitSchema,
	gsaBenefitSchema,
	doeBenefitSchema,
	dodBenefitSchema,
	tvaBenefitSchema,
	uspsBenefitSchema,
])

/* Employer Schema */
const employerSchema = z.union([
	usdaEmployerSchema,
	gsaEmployerSchema,
	doeEmployerSchema,
	dodEmployerSchema,
	tvaEmployerSchema,
	uspsEmployerSchema,
])

/* Leave Schema */
const leaveSchema = z.union([
	usdaLeaveSchema,
	gsaLeaveSchema,
	doeLeaveSchema,
	dodLeaveSchema,
	tvaLeaveSchema,
	uspsLeaveSchema,
])

/* Codes Schema */
const codesSchema = z.union([
	usdaCodesSchema,
	gsaCodesSchema,
	doeCodesSchema,
	dodCodesSchema,
	tvaCodesSchema,
	uspsCodesSchema,
])

/* Deduction Schema */
const deductionSchema = z.union([
	usdaDeductionSchema,
	gsaDeductionSchema,
	doeDeductionSchema,
	dodDeductionSchema,
	tvaDeductionSchema,
	uspsDeductionSchema,
])

/* Master Schema */
const zodQueryMasterSchema = z.object({
	basic: basicSchema,
	benefit: benefitSchema,
	employer: employerSchema,
	leave: leaveSchema,
	codes: codesSchema,
	deduction: deductionSchema,
})

/*
 *==================================================
 * MARK:		   					         EXPORTS
 *==================================================
 */

type QueriesMasterType = z.infer<typeof zodQueryMasterSchema>

const agencyOptions = ["USDA", "GSA", "DOE", "DOD", "TVA", "USPS"]

// Master Schemas
export { zodQueryMasterSchema, agencyOptions, type QueriesMasterType }

// Agency Schemas
export {
	usdaMasterSchema,
	gsaMasterSchema,
	doeMasterSchema,
	dodMasterSchema,
	tvaMasterSchema,
	uspsMasterSchema,
}
