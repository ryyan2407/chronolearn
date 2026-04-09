import { useMutation, useQueryClient } from "@tanstack/react-query";

import { attemptsService } from "../services/attempts.service";
import type { SubmitAttemptInput } from "../types/attempt";

export function useSubmitAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitAttemptInput) => attemptsService.submit(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["attempts"] });
      void queryClient.invalidateQueries({ queryKey: ["analytics-overview"] });
    }
  });
}
