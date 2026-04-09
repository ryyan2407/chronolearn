import type { Attempt } from "../../types/attempt";
import { scorePercentage } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type SkillBreakdownProps = {
  attempt: Attempt;
};

export function SkillBreakdown({ attempt }: SkillBreakdownProps) {
  const answers = attempt.answers ?? [];
  const mcqAnswers = answers.filter((answer) => answer.question?.type === "MCQ");
  const shortAnswers = answers.filter((answer) => answer.question?.type === "SHORT_ANSWER");

  const scoreGroup = (groupAnswers: Attempt["answers"]) =>
    (groupAnswers ?? []).reduce(
      (acc, answer) => {
        acc.score += answer.awardedScore;
        acc.max += answer.question?.marks ?? 0;
        return acc;
      },
      { score: 0, max: 0 }
    );

  const groups = [
    { label: "MCQ", ...scoreGroup(mcqAnswers) },
    { label: "Short answer", ...scoreGroup(shortAnswers) }
  ];

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle>Skill breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {groups.map((group) => (
          <div key={group.label} className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
            <div>
              <p className="text-sm text-slate-600">{group.label}</p>
              <p className="text-xs text-slate-500">
                {group.max ? `${scorePercentage(group.score, group.max)}% of available marks` : "No questions in this group"}
              </p>
            </div>
            <span className="font-semibold text-slate-900">{group.score} / {group.max}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
