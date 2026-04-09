import { prisma } from "../../config/db.js";

export const analyticsService = {
  async getOverview(userId: string) {
    const [materials, quizzes, attempts] = await Promise.all([
      prisma.material.count({ where: { userId } }),
      prisma.quiz.count({ where: { userId } }),
      prisma.attempt.count({ where: { userId } })
    ]);

    return { materials, quizzes, attempts };
  }
};
