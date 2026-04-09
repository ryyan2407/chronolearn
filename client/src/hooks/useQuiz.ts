import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../lib/queryKeys";
import { quizService } from "../services/quiz.service";

export function useQuiz(quizId?: string) {
  return useQuery({
    queryKey: queryKeys.quizzes.detail(quizId),
    queryFn: () => quizService.getById(quizId!),
    enabled: Boolean(quizId)
  });
}
