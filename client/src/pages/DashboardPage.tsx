import { useQuery } from "@tanstack/react-query";

import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { SectionHeader } from "../components/common/SectionHeader";
import { DashboardPageContent } from "./DashboardPageContent";
import { analyticsService } from "../services/analytics.service";
import { attemptsService } from "../services/attempts.service";
import { AppLayout } from "../components/layout/AppLayout";

export function DashboardPage() {
  const analyticsQuery = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: analyticsService.overview
  });

  const attemptsQuery = useQuery({
    queryKey: ["attempts"],
    queryFn: attemptsService.list
  });

  return (
    <AppLayout>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Dashboard"
          title="Track quiz volume, results, and recent study sessions"
          description="See your recent quiz activity, overall progress, and how much study material you have built so far."
        />
        {analyticsQuery.isLoading || attemptsQuery.isLoading ? <LoadingSpinner /> : null}
        {analyticsQuery.isError ? <ErrorState message="Analytics overview could not be loaded." /> : null}
        {attemptsQuery.isError ? <ErrorState message="Attempts could not be loaded." /> : null}
        {analyticsQuery.data && attemptsQuery.data ? (
          <DashboardPageContent analytics={analyticsQuery.data} attempts={attemptsQuery.data} />
        ) : null}
        {analyticsQuery.data && attemptsQuery.data && attemptsQuery.data.length === 0 ? (
          <EmptyState
            title="No attempt history yet"
            description="Create material, generate a quiz, and submit one attempt to make the dashboard useful."
          />
        ) : null}
      </div>
    </AppLayout>
  );
}
