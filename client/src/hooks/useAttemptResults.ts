import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../lib/queryKeys";
import { attemptsService } from "../services/attempts.service";
import type { Attempt } from "../types/attempt";

export function useAttemptResults(attemptId?: string, initialData?: Attempt | null) {
  const hasDetailedAnswers = Boolean(initialData?.answers?.length);

  return useQuery({
    queryKey: queryKeys.attempts.detail(attemptId),
    initialData: hasDetailedAnswers ? initialData : undefined,
    queryFn: () => attemptsService.getById(attemptId!),
    enabled: Boolean(attemptId)
  });
}
