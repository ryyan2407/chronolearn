import { QuestionType } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { scoreMcqAnswer } from "../../services/scoring/mcqScorer.js";
import { scoreShortAnswer } from "../../services/scoring/shortAnswerScorer.js";
import { AppError } from "../../utils/AppError.js";

export const attemptsService = {
  async submitAttempt(input: {
    quizId: string;
    userId: string;
    answers: { questionId: string; answer: string }[];
  }) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: input.quizId },
      include: { questions: true }
    });

    if (!quiz || quiz.userId !== input.userId) {
      throw new AppError("Quiz not found", 404);
    }

    const answersByQuestionId = new Map(input.answers.map((item) => [item.questionId, item.answer]));

    const scoredAnswers = await Promise.all(
      quiz.questions.map(async (question) => {
        const studentAnswer = answersByQuestionId.get(question.id) ?? "";

        if (question.type === QuestionType.MCQ) {
          const score = scoreMcqAnswer(question.correctAnswer, studentAnswer, question.marks);
          return {
            questionId: question.id,
            studentAnswer,
            awardedScore: score.score,
            feedback: score.feedback,
            evaluationJson: score
          };
        }

        const score = await scoreShortAnswer({
          prompt: question.prompt,
          rubric: question.rubric,
          sourceContext: question.sourceContext,
          studentAnswer,
          marks: question.marks
        });

        return {
          questionId: question.id,
          studentAnswer,
          awardedScore: score.score,
          feedback: score.feedback,
          evaluationJson: score.evaluationJson
        };
      })
    );

    const totalScore = scoredAnswers.reduce((sum, answer) => sum + answer.awardedScore, 0);
    const maxScore = quiz.questions.reduce((sum, question) => sum + question.marks, 0);

    return prisma.attempt.create({
      data: {
        quizId: quiz.id,
        userId: input.userId,
        totalScore,
        maxScore,
        answers: {
          create: scoredAnswers
        }
      },
      include: {
        answers: {
          include: {
            question: true
          }
        }
      }
    });
  },

  listAttempts(userId: string) {
    return prisma.attempt.findMany({
      where: {
        userId
      },
      include: {
        quiz: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  },

  async getAttemptById(attemptId: string, userId: string) {
    const attempt = await prisma.attempt.findFirst({
      where: {
        id: attemptId,
        userId
      },
      include: {
        quiz: {
          include: {
            questions: true
          }
        },
        answers: {
          include: {
            question: true
          },
          orderBy: {
            createdAt: "asc"
          }
        }
      }
    });

    if (!attempt) {
      throw new AppError("Attempt not found", 404);
    }

    return attempt;
  }
};
