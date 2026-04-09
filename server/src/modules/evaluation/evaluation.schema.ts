import { z } from "zod";

export const manualEvaluationSchema = z.object({
  prompt: z.string().min(3),
  rubric: z.record(z.any()),
  sourceContext: z.any(),
  answer: z.string().min(1),
  marks: z.number().int().min(1).max(20)
});
