export type QuestionType = "MCQ" | "SHORT_ANSWER";

export type QuizQuestion = {
  id: string;
  prompt: string;
  type: QuestionType;
  options: string[] | null;
  correctAnswer?: string | null;
  rubric?: Record<string, string> | null;
  sourceContext?: string[] | string | null;
  marks: number;
};

export type Quiz = {
  id: string;
  title: string;
  materialId: string;
  createdAt: string;
  questions: QuizQuestion[];
};

export type GenerateQuizInput = {
  materialId: string;
  title: string;
  mcqCount: number;
  shortAnswerCount: number;
};
