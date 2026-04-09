import type { AttemptAnswer } from "../../types/attempt";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type QuestionReviewCardProps = {
  answer: AttemptAnswer;
};

export function QuestionReviewCard({ answer }: QuestionReviewCardProps) {
  const maxMarks = answer.question?.marks ?? 0;
  const percentage = maxMarks ? Math.round((answer.awardedScore / maxMarks) * 100) : 0;
  const statusLabel =
    percentage >= 100 ? "Fully correct" : percentage >= 60 ? "Partially correct" : percentage > 0 ? "Needs more depth" : "Incorrect";
  const evaluation = answer.evaluationJson;
  const strengths = evaluation?.strengths ?? [];
  const missingPoints = evaluation?.missing_points ?? [];
  const sourceContext = Array.isArray(answer.question?.sourceContext)
    ? answer.question?.sourceContext
    : typeof answer.question?.sourceContext === "string"
      ? [answer.question.sourceContext]
      : [];

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
            {answer.question?.type.replace("_", " ") ?? "Question"}
          </p>
          <div className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-slate-700">{statusLabel}</div>
        </div>
        <CardTitle className="text-xl">{answer.question?.prompt ?? "Question unavailable"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 xl:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Your answer</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{answer.studentAnswer || "No answer submitted."}</p>
          </div>
          <div className="rounded-2xl bg-stone-50 px-4 py-3 xl:min-w-40">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Awarded score</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">
              {answer.awardedScore} / {maxMarks}
            </p>
            <p className="mt-1 text-xs text-slate-500">{percentage}% on this question</p>
          </div>
        </div>

        {answer.question?.type === "MCQ" && answer.question.correctAnswer ? (
          <div className="rounded-2xl bg-stone-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Correct answer</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{answer.question.correctAnswer}</p>
          </div>
        ) : null}

        {sourceContext.length ? (
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Source context</p>
            <div className="mt-2 space-y-2">
              {sourceContext.slice(0, 3).map((item, index) => (
                <p key={`${answer.id}-context-${index}`} className="rounded-2xl bg-stone-50 px-4 py-3 text-sm leading-6 text-slate-700">
                  {item}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        {strengths.length ? (
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">What worked</p>
            <div className="mt-2 space-y-2">
              {strengths.map((item, index) => (
                <p key={`${answer.id}-strength-${index}`} className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900">
                  {item}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        {missingPoints.length ? (
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">What to improve</p>
            <div className="mt-2 space-y-2">
              {missingPoints.map((item, index) => (
                <p key={`${answer.id}-missing-${index}`} className="rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                  {item}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        {answer.feedback ? (
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Overall feedback</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{answer.feedback}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
