import { Button } from "../ui/button";

type QuizNavigationProps = {
  canGoBack: boolean;
  isLastQuestion: boolean;
  isSubmitting?: boolean;
  unansweredCount: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

export function QuizNavigation({
  canGoBack,
  isLastQuestion,
  isSubmitting,
  unansweredCount,
  onBack,
  onNext,
  onSubmit
}: QuizNavigationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm text-slate-600">
        {unansweredCount === 0 ? "All questions answered." : `${unansweredCount} question${unansweredCount === 1 ? "" : "s"} still unanswered.`}
      </div>
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" onClick={onBack} disabled={!canGoBack}>
          Previous
        </Button>
        {isLastQuestion ? (
          <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit attempt"}
          </Button>
        ) : (
          <Button type="button" onClick={onNext}>
            Next question
          </Button>
        )}
      </div>
    </div>
  );
}
