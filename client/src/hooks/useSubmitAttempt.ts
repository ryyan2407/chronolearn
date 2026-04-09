import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../lib/queryKeys";
import { attemptsService } from "../services/attempts.service";
import type { SubmitAttemptInput } from "../types/attempt";

export function useSubmitAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitAttemptInput) => attemptsService.submit(payload),
    onSuccess: (attempt) => {
      queryClient.setQueryData(queryKeys.attempts.detail(attempt.id), attempt);
      void queryClient.invalidateQueries({ queryKey: queryKeys.attempts.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.analyticsOverview });
    }
  });
}
