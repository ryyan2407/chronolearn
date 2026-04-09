import { z } from "zod";

export const generateQuizSchema = z.object({
  materialId: z.string().min(1),
  title: z.string().min(3).optional(),
  mcqCount: z.number().int().min(0).max(10).default(3),
  shortAnswerCount: z.number().int().min(0).max(10).default(2)
});
