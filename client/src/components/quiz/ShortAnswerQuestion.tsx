import type { QuizQuestion } from "../../types/quiz";
import { Textarea } from "../ui/textarea";

type ShortAnswerQuestionProps = {
  question: QuizQuestion;
  value: string;
  onChange: (value: string) => void;
};

export function ShortAnswerQuestion({ question, value, onChange }: ShortAnswerQuestionProps) {
  const hint =
    typeof question.sourceContext === "string"
      ? question.sourceContext
      : Array.isArray(question.sourceContext)
        ? question.sourceContext[0]
        : undefined;

  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Write a concise explanation using causes, chronology, or significance."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? <p className="text-xs leading-5 text-slate-500">Hint: {hint}</p> : null}
    </div>
  );
}
