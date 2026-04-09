export type ApiError = {
  message: string;
  code?: string;
  details?: unknown;
};

export type AnalyticsOverview = {
  materials: number;
  quizzes: number;
  attempts: number;
};
