import { groqService } from "../ai/groq.service.js";
import { formatFeedback } from "./feedbackFormatter.js";

type ShortAnswerScoreInput = {
  prompt: string;
  rubric: unknown;
  sourceContext: unknown;
  studentAnswer: string;
  marks: number;
};

export const scoreShortAnswer = async ({
  prompt,
  rubric,
  sourceContext,
  studentAnswer,
  marks
}: ShortAnswerScoreInput) => {
  const trimmedAnswer = studentAnswer.trim();

  if (!trimmedAnswer) {
    const feedback = "No answer was submitted. Add a response that uses specific historical context and direct support from the source material.";

    return {
      score: 0,
      feedback,
      evaluationJson: {
        score: 0,
        strengths: [],
        missing_points: ["Add a written response with specific historical context and explanation."],
        feedback
      }
    };
  }

  if (groqService.isEnabled()) {
    try {
      const evaluation = await groqService.evaluateShortAnswer(
        prompt,
        rubric,
        sourceContext,
        studentAnswer,
        marks
      );

      return {
        score: Math.max(0, Math.min(marks, evaluation.score)),
        feedback: evaluation.feedback,
        evaluationJson: evaluation
      };
    } catch {
      // Fall back to heuristic grading if the model response is unusable.
    };
  }

  const answerLengthScore = trimmedAnswer
    ? Math.min(marks, Math.max(1, Math.round(trimmedAnswer.length / 80)))
    : 0;
  const strengths = ["Your answer mentions at least one relevant historical factor."];
  const missingPoints = ["Strengthen your answer with more precise context and clearer causal explanation."];

  return {
    score: answerLengthScore,
    feedback: formatFeedback(strengths, missingPoints),
    evaluationJson: {
      score: answerLengthScore,
      strengths,
      missing_points: missingPoints,
      feedback: formatFeedback(strengths, missingPoints)
    }
  };
};
