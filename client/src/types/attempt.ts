import type { Quiz } from "./quiz";

export type AnswerEvaluation = {
  score?: number;
  strengths?: string[];
  missing_points?: string[];
  feedback?: string;
};

export type AttemptAnswer = {
  id: string;
  questionId: string;
  studentAnswer: string;
  awardedScore: number;
  feedback?: string | null;
  evaluationJson?: AnswerEvaluation | null;
  question?: Quiz["questions"][number];
};

export type Attempt = {
  id: string;
  quizId: string;
  totalScore: number;
  maxScore: number;
  createdAt: string;
  answers?: AttemptAnswer[];
  quiz?: Quiz;
};

export type SubmitAttemptInput = {
  quizId: string;
  answers: Array<{
    questionId: string;
    answer: string;
  }>;
};
