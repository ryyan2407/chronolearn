import type { QuizQuestion } from "../../types/quiz";
import { cn } from "../../lib/utils";

type MCQQuestionProps = {
  question: QuizQuestion;
  value: string;
  onChange: (value: string) => void;
};

export function MCQQuestion({ question, value, onChange }: MCQQuestionProps) {
  return (
    <div className="space-y-3">
      {(question.options ?? []).map((option) => {
        const selected = value === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "w-full rounded-[24px] border px-5 py-4 text-left text-sm transition",
              selected
                ? "border-amber-500 bg-amber-50 text-slate-900"
                : "border-stone-200 bg-white hover:border-stone-300"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
