import { z } from "zod";

export const submitAttemptSchema = z.object({
  quizId: z.string().min(1),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        answer: z.string()
      })
    )
    .min(1)
});
