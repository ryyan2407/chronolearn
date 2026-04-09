import { scoreShortAnswer } from "../../services/scoring/shortAnswerScorer.js";

export const evaluationService = {
  async evaluateShortAnswer(input: {
    prompt: string;
    rubric: unknown;
    sourceContext: unknown;
    answer: string;
    marks: number;
  }) {
    return scoreShortAnswer({
      prompt: input.prompt,
      rubric: input.rubric,
      sourceContext: input.sourceContext,
      studentAnswer: input.answer,
      marks: input.marks
    });
  }
};
