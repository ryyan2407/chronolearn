import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { SectionHeader } from "../components/common/SectionHeader";
import { Button } from "../components/ui/button";
import { queryKeys } from "../lib/queryKeys";
import { DashboardPageContent } from "./DashboardPageContent";
import { analyticsService } from "../services/analytics.service";
import { attemptsService } from "../services/attempts.service";
import { AppLayout } from "../components/layout/AppLayout";

export function DashboardPage() {
  const analyticsQuery = useQuery({
    queryKey: queryKeys.analyticsOverview,
    queryFn: analyticsService.overview
  });

  const attemptsQuery = useQuery({
    queryKey: queryKeys.attempts.all,
    queryFn: attemptsService.list
  });

  return (
    <AppLayout>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Dashboard"
          title="Track quiz volume, results, and recent study sessions"
          description="See your recent quiz activity, overall progress, and how much study material you have built so far."
          action={
            <Link to="/upload">
              <Button>New quiz run</Button>
            </Link>
          }
        />
        {analyticsQuery.isLoading || attemptsQuery.isLoading ? <LoadingSpinner label="Loading your dashboard..." /> : null}
        {analyticsQuery.isError ? <ErrorState message="Analytics overview could not be loaded." /> : null}
        {attemptsQuery.isError ? <ErrorState message="Attempts could not be loaded." /> : null}
        {analyticsQuery.data && attemptsQuery.data ? (
          <DashboardPageContent analytics={analyticsQuery.data} attempts={attemptsQuery.data} />
        ) : null}
        {analyticsQuery.data && attemptsQuery.data && attemptsQuery.data.length === 0 ? (
          <EmptyState
            title="No quiz activity yet"
            description="Create study material, generate your first quiz, and submit one attempt to unlock progress tracking here."
            action={
              <Link to="/upload">
                <Button>Start first quiz</Button>
              </Link>
            }
          />
        ) : null}
      </div>
    </AppLayout>
  );
}
