import type { Attempt } from "../../types/attempt";
import { formatDate, scorePercentage } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type TrendOverviewProps = {
  attempts: Attempt[];
};

const toDayKey = (value: string) => {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
};

const getStudyStreak = (attempts: Attempt[]) => {
  const uniqueDays = [...new Set(attempts.map((attempt) => toDayKey(attempt.createdAt)))].sort((a, b) => b - a);

  if (uniqueDays.length === 0) {
    return 0;
  }

  let streak = 1;

  for (let index = 1; index < uniqueDays.length; index += 1) {
    const previousDay = uniqueDays[index - 1];
    const currentDay = uniqueDays[index];
    const dayGap = (previousDay - currentDay) / (1000 * 60 * 60 * 24);

    if (dayGap === 1) {
      streak += 1;
      continue;
    }

    break;
  }

  return streak;
};

export function TrendOverview({ attempts }: TrendOverviewProps) {
  const recentAttempts = attempts.slice(0, 6).reverse();
  const recentScores = recentAttempts.map((attempt) => scorePercentage(attempt.totalScore, attempt.maxScore));
  const latestThree = attempts.slice(0, 3);
  const previousThree = attempts.slice(3, 6);
  const latestAverage = latestThree.length
    ? Math.round(
        latestThree.reduce((total, attempt) => total + scorePercentage(attempt.totalScore, attempt.maxScore), 0) /
          latestThree.length
      )
    : 0;
  const previousAverage = previousThree.length
    ? Math.round(
        previousThree.reduce((total, attempt) => total + scorePercentage(attempt.totalScore, attempt.maxScore), 0) /
          previousThree.length
      )
    : latestAverage;
  const momentum = latestAverage - previousAverage;
  const streak = getStudyStreak(attempts);

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle>Trend overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-stone-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Study streak</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{streak} day{streak === 1 ? "" : "s"}</p>
            <p className="mt-1 text-sm text-slate-600">Based on consecutive days with at least one completed attempt.</p>
          </div>
          <div className="rounded-2xl bg-stone-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Momentum</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {momentum > 0 ? "+" : ""}
              {momentum} pts
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Comparing your latest three attempts against the previous three.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-900">Recent score trend</p>
            <p className="text-xs text-slate-500">Latest {recentAttempts.length} attempts</p>
          </div>
          {recentAttempts.length ? (
            <div className="space-y-3">
              {recentAttempts.map((attempt, index) => {
                const score = recentScores[index];

                return (
                  <div key={attempt.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <p className="min-w-0 truncate text-slate-700">{attempt.quiz?.title ?? "Quiz attempt"}</p>
                      <div className="shrink-0 text-right">
                        <p className="font-semibold text-slate-900">{score}%</p>
                        <p className="text-xs text-slate-500">{formatDate(attempt.createdAt)}</p>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-600">Complete a few quizzes to start seeing a score trend.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
