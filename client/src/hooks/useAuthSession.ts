import { useQuery } from "@tanstack/react-query";

import { authService } from "../services/auth.service";

export function useAuthSession() {
  return useQuery({
    queryKey: ["auth-session"],
    queryFn: authService.me,
    retry: false
  });
}
