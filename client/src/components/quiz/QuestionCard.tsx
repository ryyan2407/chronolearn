import type { QuizQuestion } from "../../types/quiz";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { MCQQuestion } from "./MCQQuestion";
import { ShortAnswerQuestion } from "./ShortAnswerQuestion";

type QuestionCardProps = {
  question: QuizQuestion;
  value: string;
  onChange: (value: string) => void;
};

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  const sourceContext =
    typeof question.sourceContext === "string"
      ? [question.sourceContext]
      : Array.isArray(question.sourceContext)
        ? question.sourceContext
        : [];
  const rubricEntries = question.rubric ? Object.entries(question.rubric) : [];

  return (
    <Card className="bg-white/95">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">{question.type.replace("_", " ")}</p>
          <div className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-slate-600">{question.marks} mark{question.marks === 1 ? "" : "s"}</div>
        </div>
        <CardTitle className="font-serif text-2xl leading-9">{question.prompt}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {sourceContext.length ? (
          <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Source Context</p>
            <div className="mt-3 space-y-2">
              {sourceContext.slice(0, 2).map((item, index) => (
                <p key={`${question.id}-context-${index}`} className="text-sm leading-6 text-slate-700">
                  {item}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        {question.type === "SHORT_ANSWER" && rubricEntries.length ? (
          <div className="rounded-[24px] border border-amber-200 bg-amber-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">What A Strong Answer Should Show</p>
            <div className="mt-3 space-y-2">
              {rubricEntries.map(([label, detail]) => (
                <p key={`${question.id}-${label}`} className="text-sm leading-6 text-amber-950">
                  <span className="font-medium capitalize">{label}:</span> {detail}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        {question.type === "MCQ" ? (
          <MCQQuestion question={question} value={value} onChange={onChange} />
        ) : (
          <ShortAnswerQuestion question={question} value={value} onChange={onChange} />
        )}
      </CardContent>
    </Card>
  );
}
