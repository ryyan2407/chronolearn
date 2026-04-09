import type { Attempt } from "../../types/attempt";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type ImprovementTipsProps = {
  attempt: Attempt;
};

export function ImprovementTips({ attempt }: ImprovementTipsProps) {
  const lowScoring = (attempt.answers ?? []).filter((answer) => {
    const marks = answer.question?.marks ?? 0;
    return marks > 0 && answer.awardedScore < marks;
  });

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle>Improvement tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {lowScoring.length ? (
          lowScoring.slice(0, 3).map((answer) => (
            <div key={answer.id} className="rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-slate-700">
              <p>
                Revisit <span className="font-medium text-slate-900">{answer.question?.prompt}</span>.
              </p>
              <p className="mt-2">
                Focus on adding clearer historical context, stronger causation, and more direct support from the source material.
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-600">Strong attempt. Use the review below to keep reinforcing the same depth of explanation.</p>
        )}
      </CardContent>
    </Card>
  );
}
