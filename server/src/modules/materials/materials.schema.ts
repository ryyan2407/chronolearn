import { z } from "zod";

export const createTopicMaterialSchema = z.object({
  title: z.string().min(3),
  topic: z.string().min(3),
  sourceText: z.string().min(20)
});
