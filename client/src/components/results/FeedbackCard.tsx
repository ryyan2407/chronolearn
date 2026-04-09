import type { AttemptAnswer } from "../../types/attempt";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type FeedbackCardProps = {
  answers: AttemptAnswer[];
};

export function FeedbackCard({ answers }: FeedbackCardProps) {
  const feedback = answers
    .map((answer) => ({
      id: answer.id,
      prompt: answer.question?.prompt ?? "Question review",
      feedback: answer.feedback
    }))
    .filter((item): item is { id: string; prompt: string; feedback: string } => Boolean(item.feedback));

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle>Generated feedback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {feedback.length ? (
          feedback.map((item) => (
            <div key={item.id} className="rounded-2xl bg-stone-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Question feedback</p>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-900">{item.prompt}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{item.feedback}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-600">No written feedback was returned for this attempt.</p>
        )}
      </CardContent>
    </Card>
  );
}
