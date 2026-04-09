import { Link } from "react-router-dom";

import type { Attempt } from "../../types/attempt";
import { formatDate, scorePercentage } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type StudyInsightsProps = {
  attempts: Attempt[];
};

export function StudyInsights({ attempts }: StudyInsightsProps) {
  const recentAttempts = attempts.slice(0, 3);
  const latestAttempt = attempts[0];
  const bestAttempt = [...attempts].sort(
    (left, right) =>
      scorePercentage(right.totalScore, right.maxScore) - scorePercentage(left.totalScore, left.maxScore)
  )[0];
  const recentAverage =
    recentAttempts.length === 0
      ? 0
      : Math.round(
          recentAttempts.reduce(
            (total, attempt) => total + scorePercentage(attempt.totalScore, attempt.maxScore),
            0
          ) / recentAttempts.length
        );

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle>Study insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl bg-stone-50 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Recent average</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{recentAverage}%</p>
          <p className="mt-1 text-sm text-slate-600">
            Based on your last {recentAttempts.length || 0} attempt{recentAttempts.length === 1 ? "" : "s"}.
          </p>
        </div>

        {latestAttempt ? (
          <div className="rounded-2xl bg-stone-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Most recent session</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{latestAttempt.quiz?.title ?? "Quiz attempt"}</p>
            <p className="mt-1 text-sm text-slate-600">
              {formatDate(latestAttempt.createdAt)} · {scorePercentage(latestAttempt.totalScore, latestAttempt.maxScore)}%
            </p>
            <div className="mt-3">
              <Link to={`/results/${latestAttempt.id}`}>
                <Button variant="outline">Review latest</Button>
              </Link>
            </div>
          </div>
        ) : null}

        {bestAttempt ? (
          <div className="rounded-2xl bg-amber-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-amber-800">Best recent performance</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{bestAttempt.quiz?.title ?? "Quiz attempt"}</p>
            <p className="mt-1 text-sm text-slate-700">
              {scorePercentage(bestAttempt.totalScore, bestAttempt.maxScore)}% · {bestAttempt.totalScore} / {bestAttempt.maxScore}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
