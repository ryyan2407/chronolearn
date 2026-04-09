import { Progress } from "../ui/progress";

type QuizProgressProps = {
  currentIndex: number;
  total: number;
  answers: Record<string, string>;
  questionIds: string[];
  onJump: (index: number) => void;
};

export function QuizProgress({ currentIndex, total, answers, questionIds, onJump }: QuizProgressProps) {
  const value = total ? ((currentIndex + 1) / total) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          Question {Math.min(currentIndex + 1, total)} of {total}
        </span>
        <span>{Math.round(value)}%</span>
      </div>
      <Progress value={value} />
      <div className="flex flex-wrap gap-2">
        {questionIds.map((questionId, index) => {
          const answered = Boolean(answers[questionId]?.trim());
          const isActive = index === currentIndex;

          return (
            <button
              key={questionId}
              type="button"
              onClick={() => onJump(index)}
              className={[
                "inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm transition",
                isActive
                  ? "border-slate-900 bg-slate-900 text-white"
                  : answered
                    ? "border-amber-400 bg-amber-50 text-amber-900"
                    : "border-stone-300 bg-white text-slate-600 hover:border-stone-400"
              ].join(" ")}
              aria-label={`Go to question ${index + 1}${answered ? ", answered" : ", unanswered"}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
