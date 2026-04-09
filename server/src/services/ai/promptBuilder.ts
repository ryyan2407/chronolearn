type QuizPromptArgs = {
  sourceText: string;
  mcqCount: number;
  shortAnswerCount: number;
  title: string;
};

type EvaluationPromptArgs = {
  prompt: string;
  rubric: unknown;
  sourceContext: unknown;
  studentAnswer: string;
  marks: number;
};

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const buildSourceExcerpt = (sourceText: string, maxLength = 6000) => {
  const normalized = normalizeWhitespace(sourceText);

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const head = normalized.slice(0, Math.floor(maxLength * 0.7));
  const tail = normalized.slice(-Math.floor(maxLength * 0.3));

  return `${head}\n...\n${tail}`;
};

export const quizSystemPrompt = [
  "You generate history quizzes from study material.",
  "Return strict JSON only.",
  "Do not wrap JSON in markdown fences.",
  "Do not include commentary before or after the JSON.",
  "Use only the supplied source material."
].join(" ");

export const shortAnswerEvaluationSystemPrompt = [
  "You evaluate student history answers against a rubric.",
  "Return strict JSON only.",
  "Do not wrap JSON in markdown fences.",
  "Do not include commentary before or after the JSON."
].join(" ");

export const buildQuizPrompt = ({
  sourceText,
  mcqCount,
  shortAnswerCount,
  title
}: QuizPromptArgs): string => {
  return [
    "Generate a history quiz as strict JSON.",
    `Quiz title: ${title}`,
    `Create ${mcqCount} MCQs and ${shortAnswerCount} short-answer questions.`,
    "Output schema:",
    '{ "questions": [',
    '  { "type": "MCQ", "prompt": "string", "options": ["string", "string", "string", "string"], "correctAnswer": "string" },',
    '  { "type": "SHORT_ANSWER", "prompt": "string", "rubric": { "accuracy": "string", "context": "string", "causation": "string" }, "sourceContext": ["string", "string"], "marks": 6 }',
    "] }",
    "Rules:",
    "- Return exactly the requested number of questions.",
    "- Every MCQ must have exactly 4 distinct options.",
    "- Every MCQ correctAnswer must match one option exactly.",
    "- Every short-answer question must include rubric, sourceContext, and marks.",
    "- Make the questions materially different from each other.",
    `Source material: ${buildSourceExcerpt(sourceText)}`
  ].join("\n");
};

export const buildShortAnswerEvaluationPrompt = ({
  prompt,
  rubric,
  sourceContext,
  studentAnswer,
  marks
}: EvaluationPromptArgs): string => {
  return [
    "Evaluate a student's history short-answer response as strict JSON.",
    "Write feedback in direct, student-facing language using words like 'you' and 'your answer'.",
    `Question: ${prompt}`,
    `Rubric: ${JSON.stringify(rubric)}`,
    `Source context: ${JSON.stringify(sourceContext)}`,
    `Student answer: ${studentAnswer}`,
    `Maximum marks: ${marks}`,
    'Return JSON with exactly these keys: { "score": number, "strengths": string[], "missing_points": string[], "feedback": string }.'
  ].join("\n");
};
