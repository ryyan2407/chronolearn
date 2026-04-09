import { useQuery } from "@tanstack/react-query";

import { quizService } from "../services/quiz.service";

export function useQuiz(quizId?: string) {
  return useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => quizService.getById(quizId!),
    enabled: Boolean(quizId)
  });
}
