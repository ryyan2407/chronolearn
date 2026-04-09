import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../lib/queryKeys";
import { quizService } from "../services/quiz.service";
import type { GenerateQuizInput } from "../types/quiz";

export function useGenerateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GenerateQuizInput) => quizService.generate(payload),
    onSuccess: (quiz) => {
      queryClient.setQueryData(queryKeys.quizzes.detail(quiz.id), quiz);
      void queryClient.invalidateQueries({ queryKey: queryKeys.quizzes.all });
    }
  });
}
