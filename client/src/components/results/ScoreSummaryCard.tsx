import type { Attempt } from "../../types/attempt";
import { scorePercentage } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type ScoreSummaryCardProps = {
  attempt: Attempt;
};

export function ScoreSummaryCard({ attempt }: ScoreSummaryCardProps) {
  const percentage = scorePercentage(attempt.totalScore, attempt.maxScore);
  const verdict =
    percentage >= 85 ? "Excellent grasp" : percentage >= 70 ? "Solid understanding" : percentage >= 50 ? "Mixed result" : "Needs another pass";

  return (
    <Card className="bg-slate-900 text-stone-50">
      <CardHeader>
        <CardTitle className="font-serif text-3xl">Overall result</CardTitle>
        <p className="text-sm leading-6 text-stone-300">{verdict}. Use the review below to see where your answer quality held up and where it slipped.</p>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-stone-300">Score</p>
          <p className="mt-2 text-4xl font-semibold">{attempt.totalScore}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-stone-300">Max score</p>
          <p className="mt-2 text-4xl font-semibold">{attempt.maxScore}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-stone-300">Percentage</p>
          <p className="mt-2 text-4xl font-semibold">{percentage}%</p>
        </div>
      </CardContent>
    </Card>
  );
}
