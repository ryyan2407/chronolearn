import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import { appName } from "../../lib/constants";
import { useAuthSession } from "../../hooks/useAuthSession";
import { authService } from "../../services/auth.service";
import { Button } from "../ui/button";

export function Navbar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const sessionQuery = useAuthSession();
  const resetSessionState = () => {
    queryClient.clear();
    queryClient.setQueryData(["auth-session"], null);
    navigate("/login");
  };

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      resetSessionState();
    },
    onError: () => {
      resetSessionState();
    }
  });
  const user = sessionQuery.data?.user;

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-stone-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-amber-300">
            CL
          </div>
          <div>
            <p className="font-serif text-xl text-slate-900">{appName}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Contextual history learning</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <Button variant="ghost" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
                {logoutMutation.isPending ? "Logging out..." : "Log out"}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
