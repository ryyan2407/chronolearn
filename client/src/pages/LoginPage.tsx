import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { AppLayout } from "../components/layout/AppLayout";
import { ErrorState } from "../components/common/ErrorState";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useAuthSession } from "../hooks/useAuthSession";
import { getPostAuthRedirectTarget } from "../lib/auth";
import { authService, getApiErrorMessage } from "../services/auth.service";

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const sessionQuery = useAuthSession();
  const redirectTarget = getPostAuthRedirectTarget(location.state);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState("");

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth-session"] });
      navigate(redirectTarget, { replace: true });
    },
    onError: (error) => {
      setSubmitError(getApiErrorMessage(error, "Login failed."));
    }
  });

  useEffect(() => {
    if (sessionQuery.data?.user) {
      navigate(redirectTarget, { replace: true });
    }
  }, [navigate, redirectTarget, sessionQuery.data?.user]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    loginMutation.mutate({ email, password });
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-md">
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Log in</CardTitle>
            <CardDescription>Sign in with your ChronoLearn account to access your materials and quiz history.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {submitError ? <ErrorState message={submitError} /> : null}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
              <Button className="w-full" disabled={loginMutation.isPending || sessionQuery.isLoading || !email || !password}>
                {loginMutation.isPending ? "Signing in..." : "Continue"}
              </Button>
            </form>
            <p className="text-sm text-slate-600">
              Need an account?{" "}
              <Link
                to="/register"
                state={location.state}
                className="font-medium text-slate-900 underline decoration-amber-400 underline-offset-4"
              >
                Register
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
