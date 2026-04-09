import type { Attempt } from "../../types/attempt";
import { scorePercentage } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

type ProgressOverviewProps = {
  attempts: Attempt[];
};

export function ProgressOverview({ attempts }: ProgressOverviewProps) {
  const average =
    attempts.length === 0
      ? 0
      : Math.round(
          attempts.reduce((sum, attempt) => sum + scorePercentage(attempt.totalScore, attempt.maxScore), 0) /
            attempts.length
        );

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle>Progress overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <p className="text-sm text-slate-600">Average performance across attempts</p>
          <p className="text-2xl font-semibold text-slate-900">{average}%</p>
        </div>
        <Progress value={average} />
      </CardContent>
    </Card>
  );
}
