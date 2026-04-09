export const queryKeys = {
  authSession: ["auth-session"] as const,
  analyticsOverview: ["analytics-overview"] as const,
  materials: {
    all: ["materials"] as const
  },
  quizzes: {
    all: ["quizzes"] as const,
    detail: (quizId?: string) => ["quiz", quizId] as const
  },
  attempts: {
    all: ["attempts"] as const,
    detail: (attemptId?: string) => ["attempts", "detail", attemptId] as const
  }
};
