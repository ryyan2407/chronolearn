import { Navigate, Route, Routes } from "react-router-dom";

import { DashboardPage } from "../pages/DashboardPage";
import { HistoryPage } from "../pages/HistoryPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { QuizPage } from "../pages/QuizPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ResultsPage } from "../pages/ResultsPage";
import { UploadPage } from "../pages/UploadPage";
import { RequireAuth } from "./RequireAuth";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/quiz/:quizId" element={<QuizPage />} />
        <Route path="/results/:attemptId" element={<ResultsPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
