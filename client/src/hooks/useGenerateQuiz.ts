import { useMutation, useQueryClient } from "@tanstack/react-query";

import { quizService } from "../services/quiz.service";
import type { GenerateQuizInput } from "../types/quiz";

export function useGenerateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GenerateQuizInput) => quizService.generate(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    }
  });
}
