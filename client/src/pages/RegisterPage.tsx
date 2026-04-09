import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { AppLayout } from "../components/layout/AppLayout";
import { ErrorState } from "../components/common/ErrorState";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAuthSession } from "../hooks/useAuthSession";
import { getPostAuthRedirectTarget } from "../lib/auth";
import { queryKeys } from "../lib/queryKeys";
import { parseApiErrorMessage } from "../services/api";
import { authService } from "../services/auth.service";

export function RegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const sessionQuery = useAuthSession();
  const redirectTarget = getPostAuthRedirectTarget(location.state);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState("");

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: async (response) => {
      queryClient.setQueryData(queryKeys.authSession, response);
      navigate(redirectTarget, { replace: true });
    },
    onError: (error) => {
      setSubmitError(parseApiErrorMessage(error, "Registration failed."));
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
    registerMutation.mutate({ name, email, password });
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-md">
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Create account</CardTitle>
            <CardDescription>Create an account and ChronoLearn will keep your materials, quizzes, and attempts tied to your session.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {submitError ? <ErrorState message={submitError} /> : null}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
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
                autoComplete="new-password"
              />
              <Button
                className="w-full"
                disabled={registerMutation.isPending || sessionQuery.isLoading || !name || !email || password.length < 8}
              >
                {registerMutation.isPending ? "Creating account..." : "Register"}
              </Button>
            </form>
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                state={location.state}
                className="font-medium text-slate-900 underline decoration-amber-400 underline-offset-4"
              >
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
