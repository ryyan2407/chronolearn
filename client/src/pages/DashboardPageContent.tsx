import { QuickActions } from "../components/dashboard/QuickActions";
import { ProgressOverview } from "../components/dashboard/ProgressOverview";
import { RecentAttempts } from "../components/dashboard/RecentAttempts";
import { StatsCard } from "../components/dashboard/StatsCard";
import { StudyInsights } from "../components/dashboard/StudyInsights";
import { TrendOverview } from "../components/dashboard/TrendOverview";
import type { Attempt } from "../types/attempt";
import type { AnalyticsOverview } from "../types/api";

type DashboardPageContentProps = {
  analytics: AnalyticsOverview;
  attempts: Attempt[];
};

export function DashboardPageContent({ analytics, attempts }: DashboardPageContentProps) {
  const averageScore =
    attempts.length === 0
      ? 0
      : Math.round(attempts.reduce((sum, attempt) => sum + (attempt.maxScore ? attempt.totalScore / attempt.maxScore : 0), 0) /
          attempts.length *
          100);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-4">
        <StatsCard label="Materials" value={analytics.materials} />
        <StatsCard label="Quizzes" value={analytics.quizzes} />
        <StatsCard label="Attempts" value={analytics.attempts} />
        <StatsCard label="Average score" value={`${averageScore}%`} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <RecentAttempts attempts={attempts} />
        <ProgressOverview attempts={attempts} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <TrendOverview attempts={attempts} />
        <StudyInsights attempts={attempts} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <QuickActions />
        <div className="rounded-[28px] border border-stone-200 bg-white/80 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Next step</p>
          <p className="mt-3 font-serif text-2xl text-slate-900">Turn weak attempts into targeted review.</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Open your latest result, study the missed context, then create another quiz from the same material to see if your trend line improves.
          </p>
        </div>
      </div>
    </div>
  );
}
