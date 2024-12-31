import {
	AnalyzeDocumentCommandOutput,
	BlockType,
	RelationshipType,
} from "@aws-sdk/client-textract"

interface QuerySummary {
	[key: string]: {
		question: string | undefined
		questionKey: string | undefined
	}
}

export const extractQueries = async (data: AnalyzeDocumentCommandOutput) => {
	if (!data.Blocks) {
		console.error("No blocks found in the response")
		return []
	}
	const allQueries = data.Blocks.reduce(
		(summ: { [key: string]: { Text: string; Alias: string } }, block) => {
			if (block.BlockType === BlockType.QUERY && block.Id) {
				summ[block.Id] = {
					Text: block.Query?.Text ?? "",
					Alias: block.Query?.Alias ?? "",
				}
			}
			return summ
		},
		{}
	)

	// relationshipID -> query text (the question)
	const allQueryQuestions = data.Blocks.reduce(
		(summ: QuerySummary, block) => {
			if (block.BlockType === BlockType.QUERY) {
				const allAnswers = block.Relationships?.filter(
					(relationship) =>
						relationship.Type === RelationshipType.ANSWER
				)
				allAnswers?.forEach((answer) => {
					if (block.Id && answer.Ids) {
						summ[answer.Ids.join(",")] = {
							question: allQueries[block.Id]?.Text,
							questionKey: allQueries[block.Id]?.Alias,
						}
					}
				})
			}
			return summ
		},
		{}
	)
	console.log({ allQueries })
	console.log({ allQueryQuestions })
	return data.Blocks?.filter(
		(block) => block.BlockType === BlockType.QUERY_RESULT
	).map((result) => {
		if (!result.Id) {
			return {
				question: undefined,
				answer: result.Text,
				questionKey: undefined,
			}
		}
		return {
			question: allQueryQuestions[result.Id]?.question,
			answer: result.Text,
			questionKey: allQueryQuestions[result.Id]?.questionKey,
		}
	})
}
