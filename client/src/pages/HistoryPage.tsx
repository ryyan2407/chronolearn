import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { SectionHeader } from "../components/common/SectionHeader";
import { AppLayout } from "../components/layout/AppLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { queryKeys } from "../lib/queryKeys";
import { attemptsService } from "../services/attempts.service";
import { formatDate, scorePercentage } from "../lib/utils";

export function HistoryPage() {
  const attemptsQuery = useQuery({
    queryKey: queryKeys.attempts.all,
    queryFn: attemptsService.list
  });
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "best">("newest");
  const filteredAttempts = useMemo(() => {
    const attempts = attemptsQuery.data ?? [];
    const normalizedSearch = search.trim().toLowerCase();
    const visibleAttempts = normalizedSearch
      ? attempts.filter((attempt) =>
          (attempt.quiz?.title ?? "quiz attempt").toLowerCase().includes(normalizedSearch)
        )
      : attempts;

    if (sortOrder === "best") {
      return [...visibleAttempts].sort(
        (left, right) =>
          scorePercentage(right.totalScore, right.maxScore) - scorePercentage(left.totalScore, left.maxScore)
      );
    }

    return visibleAttempts;
  }, [attemptsQuery.data, search, sortOrder]);

  return (
    <AppLayout>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="History"
          title="Attempt history and recent scores"
          description="Review earlier quiz runs, compare scores, and reopen detailed results whenever you want another pass."
        />
        {attemptsQuery.isLoading ? <LoadingSpinner label="Loading your attempt history..." /> : null}
        {attemptsQuery.isError ? <ErrorState message="Attempts could not be loaded." /> : null}
        {attemptsQuery.data?.length ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <Input
                placeholder="Search by quiz title"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <select
                className="flex h-11 rounded-2xl border border-input bg-white px-4 text-sm"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as "newest" | "best")}
              >
                <option value="newest">Newest first</option>
                <option value="best">Best score first</option>
              </select>
            </div>
            {filteredAttempts.map((attempt) => (
              <Card key={attempt.id} className="bg-white/90">
                <CardHeader className="flex-row items-center justify-between">
                  <div>
                    <CardTitle>{attempt.quiz?.title ?? "Quiz attempt"}</CardTitle>
                    <p className="text-sm text-slate-500">{formatDate(attempt.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-amber-700">
                      {scorePercentage(attempt.totalScore, attempt.maxScore)}%
                    </p>
                    <p className="text-xs text-slate-500">
                      {attempt.totalScore} / {attempt.maxScore}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm leading-6 text-slate-600">
                    Reopen this result to review feedback, source context, and where you lost marks.
                  </p>
                  <Link to={`/results/${attempt.id}`}>
                    <Button variant="outline">Open results</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
        {attemptsQuery.data?.length && filteredAttempts.length === 0 ? (
          <EmptyState title="No matching attempts" description="Try a different search term or switch the sorting mode." />
        ) : null}
        {attemptsQuery.data?.length === 0 ? (
          <EmptyState
            title="No saved attempts"
            description="Finish one quiz and your results will start building a searchable history here."
            action={
              <Link to="/upload">
                <Button>Generate a quiz</Button>
              </Link>
            }
          />
        ) : null}
      </div>
    </AppLayout>
  );
}
