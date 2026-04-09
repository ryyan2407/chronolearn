import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../lib/queryKeys";
import { authService } from "../services/auth.service";

export function useAuthSession() {
  return useQuery({
    queryKey: queryKeys.authSession,
    queryFn: authService.me,
    retry: false
  });
}
