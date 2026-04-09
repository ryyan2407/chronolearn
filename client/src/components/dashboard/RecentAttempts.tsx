import type { Attempt } from "../../types/attempt";
import { Link } from "react-router-dom";
import { formatDate, scorePercentage } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type RecentAttemptsProps = {
  attempts: Attempt[];
};

export function RecentAttempts({ attempts }: RecentAttemptsProps) {
  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle>Recent attempts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {attempts.length ? (
          attempts.slice(0, 5).map((attempt) => (
            <div key={attempt.id} className="rounded-2xl bg-stone-50 px-4 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="break-words font-medium text-slate-900">{attempt.quiz?.title ?? "Quiz attempt"}</p>
                  <p className="text-xs text-slate-500">{formatDate(attempt.createdAt)}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-amber-700">
                  {scorePercentage(attempt.totalScore, attempt.maxScore)}%
                </p>
              </div>
              <div className="mt-4">
                <Link to={`/results/${attempt.id}`}>
                  <Button size="sm" variant="outline">Open results</Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-600">No attempts yet. Finish one quiz and your latest results will show up here.</p>
        )}
      </CardContent>
    </Card>
  );
}
