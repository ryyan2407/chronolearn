import type { Prisma } from "@prisma/client";

export type QuestionPayload = {
  prompt: string;
  type: "MCQ" | "SHORT_ANSWER";
  options?: string[];
  correctAnswer?: string;
  rubric?: Prisma.InputJsonValue;
  sourceContext?: Prisma.InputJsonValue;
  marks: number;
};
