import { Link, useLocation, useParams } from "react-router-dom";

import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { SectionHeader } from "../components/common/SectionHeader";
import { AppLayout } from "../components/layout/AppLayout";
import { Button } from "../components/ui/button";
import { FeedbackCard } from "../components/results/FeedbackCard";
import { ImprovementTips } from "../components/results/ImprovementTips";
import { QuestionReviewCard } from "../components/results/QuestionReviewCard";
import { ScoreSummaryCard } from "../components/results/ScoreSummaryCard";
import { SkillBreakdown } from "../components/results/SkillBreakdown";
import { useAttemptResults } from "../hooks/useAttemptResults";
import type { Attempt } from "../types/attempt";

export function ResultsPage() {
  const { attemptId } = useParams();
  const location = useLocation();
  const initialAttempt = (location.state as { attempt?: Attempt } | null)?.attempt;
  const attemptQuery = useAttemptResults(attemptId, initialAttempt);
  const answers = attemptQuery.data?.answers ?? [];

  return (
    <AppLayout>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Results"
          title="Review the score, feedback, and question-level outcomes"
          description="Review how you performed, where you lost marks, and what to revisit before the next attempt."
          action={
            <Link to="/history">
              <Button variant="outline">Back to history</Button>
            </Link>
          }
        />
        {attemptQuery.isLoading ? <LoadingSpinner label="Loading your results..." /> : null}
        {attemptQuery.isError ? <ErrorState message="Attempt results could not be loaded." /> : null}
        {attemptQuery.data ? (
          <>
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <ScoreSummaryCard attempt={attemptQuery.data} />
              <SkillBreakdown attempt={attemptQuery.data} />
            </div>
            {answers.length ? (
              <>
                <div className="grid gap-6 xl:grid-cols-2">
                  <FeedbackCard answers={answers} />
                  <ImprovementTips attempt={attemptQuery.data} />
                </div>
                <div className="space-y-4">
                  {answers.map((answer) => (
                    <QuestionReviewCard key={answer.id} answer={answer} />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState
                title="Detailed review unavailable"
                description="This attempt is missing the full question-by-question breakdown. Try opening another result from history or generating a new quiz to continue practicing."
              />
            )}
          </>
        ) : null}
        {attemptQuery.data === null ? (
          <EmptyState title="Attempt not found" description="The result you opened is not available for this account." />
        ) : null}
      </div>
    </AppLayout>
  );
}
