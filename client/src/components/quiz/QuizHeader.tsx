import { Badge } from "../ui/badge";

type QuizHeaderProps = {
  title: string;
  totalQuestions: number;
  answeredQuestions: number;
};

export function QuizHeader({ title, totalQuestions, answeredQuestions }: QuizHeaderProps) {
  return (
    <div className="space-y-3">
      <Badge>Quiz session</Badge>
      <h1 className="font-serif text-4xl text-slate-900">{title}</h1>
      <p className="text-sm text-slate-600">
        {totalQuestions} questions mixing factual recall and contextual reasoning. {answeredQuestions} answered so far.
      </p>
    </div>
  );
}
