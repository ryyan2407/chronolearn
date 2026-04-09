import { Navigate, Outlet, useLocation } from "react-router-dom";

import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useAuthSession } from "../hooks/useAuthSession";

export function RequireAuth() {
  const location = useLocation();
  const sessionQuery = useAuthSession();

  if (sessionQuery.isLoading) {
    return (
      <div className="min-h-screen bg-parchment">
        <LoadingSpinner />
      </div>
    );
  }

  if (!sessionQuery.data?.user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
