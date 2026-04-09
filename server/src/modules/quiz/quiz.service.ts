import { QuestionType } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { groqService } from "../../services/ai/groq.service.js";
import { buildDefaultRubric } from "../../services/scoring/rubricBuilder.js";
import { AppError } from "../../utils/AppError.js";
import { DEFAULT_MCQ_MARKS, DEFAULT_SHORT_ANSWER_MARKS } from "../../utils/constants.js";
import { logger } from "../../utils/logger.js";
import type { QuestionPayload } from "./quiz.types.js";

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const sentenceSplitRegex = /(?<=[.!?])\s+/;

const sentenceCase = (value: string) => {
  const normalized = normalizeWhitespace(value).replace(/^[^a-zA-Z0-9]+/, "");

  if (!normalized) {
    return "";
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const getChunkSentences = (text: string) =>
  text
    .split(sentenceSplitRegex)
    .map((sentence) => sentenceCase(sentence))
    .filter((sentence) => sentence.length >= 40);

const uniqueBy = <T>(items: T[], getKey: (item: T) => string) => {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = getKey(item);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

const buildFallbackMcqOptions = (correctSentence: string, distractorPool: string[]) => {
  const distractors = uniqueBy(
    distractorPool
      .filter((sentence) => sentence !== correctSentence)
      .map((sentence) => sentenceCase(sentence.slice(0, 140))),
    (sentence) => sentence.toLowerCase()
  ).slice(0, 3);

  while (distractors.length < 3) {
    distractors.push(
      [
        "The source argues that isolated events matter more than broader context.",
        "The material claims historical change happens without identifiable causes.",
        "The text suggests chronology is less useful than memorizing disconnected facts."
      ][distractors.length]
    );
  }

  return [sentenceCase(correctSentence.slice(0, 140)), ...distractors];
};

const fallbackQuiz = (
  materialTitle: string,
  sourceText: string,
  chunkTexts: string[],
  mcqCount: number,
  shortAnswerCount: number
): QuestionPayload[] => {
  const excerpt = sourceText.slice(0, 400);
  const questions: QuestionPayload[] = [];
  const chunkPool = chunkTexts.length > 0 ? chunkTexts : [sourceText];
  const chunkContexts = uniqueBy(
    chunkPool
      .map((chunk, index) => ({
        index,
        content: normalizeWhitespace(chunk),
        sentences: getChunkSentences(chunk)
      }))
      .filter((chunk) => chunk.content.length > 0),
    (chunk) => chunk.content.toLowerCase()
  );
  const sentencePool = uniqueBy(
    chunkContexts.flatMap((chunk) => chunk.sentences),
    (sentence) => sentence.toLowerCase()
  );

  for (let index = 0; index < mcqCount; index += 1) {
    const correctSentence = sentencePool[index] ?? sentenceCase(excerpt.slice(0, 140));
    const options = buildFallbackMcqOptions(correctSentence, sentencePool);
    const rotation = index % options.length;

    questions.push({
      type: "MCQ",
      prompt:
        sentencePool.length > 0
          ? `Which statement is most clearly supported by the study material on ${materialTitle}?`
          : `Which statement best matches a key idea from ${materialTitle}?`,
      options: options.slice(rotation).concat(options.slice(0, rotation)),
      correctAnswer: sentenceCase(correctSentence.slice(0, 140)),
      marks: DEFAULT_MCQ_MARKS
    });
  }

  for (let index = 0; index < shortAnswerCount; index += 1) {
    const chunk = chunkContexts[index % Math.max(chunkContexts.length, 1)];
    const sourceContext = chunk?.content.slice(0, 400) ?? excerpt;
    const anchorSentence = chunk?.sentences[0] ?? sentencePool[index] ?? excerpt;

    questions.push({
      type: "SHORT_ANSWER",
      prompt:
        chunkContexts.length > 1
          ? `Using the source material, explain the significance of this idea in ${materialTitle}: "${anchorSentence.slice(0, 120)}"`
          : `Explain the main causes and context behind ${materialTitle}.`,
      rubric: buildDefaultRubric(materialTitle),
      sourceContext,
      marks: DEFAULT_SHORT_ANSWER_MARKS
    });
  }

  return questions;
};

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string" && item.trim().length > 0);

const normalizeAiQuestions = (questions: unknown[]): QuestionPayload[] => {
  return questions
    .map((question): QuestionPayload | null => {
      if (!question || typeof question !== "object") {
        return null;
      }

      const candidate = question as Record<string, unknown>;
      const prompt = typeof candidate.prompt === "string" ? candidate.prompt.trim() : "";
      const type = candidate.type;
      const marks = typeof candidate.marks === "number" && Number.isFinite(candidate.marks) ? candidate.marks : undefined;

      if (!prompt || (type !== "MCQ" && type !== "SHORT_ANSWER")) {
        return null;
      }

      if (type === "MCQ") {
        const options = isStringArray(candidate.options) ? candidate.options.map((item) => item.trim()) : null;
        const correctAnswer =
          typeof candidate.correctAnswer === "string" && candidate.correctAnswer.trim().length > 0
            ? candidate.correctAnswer.trim()
            : null;

        if (!options || options.length < 2 || !correctAnswer) {
          return null;
        }

        return {
          prompt,
          type,
          options,
          correctAnswer,
          marks: DEFAULT_MCQ_MARKS
        };
      }

      return {
        prompt,
        type,
        rubric: typeof candidate.rubric === "object" && candidate.rubric !== null ? candidate.rubric : undefined,
        sourceContext:
          typeof candidate.sourceContext === "string" || Array.isArray(candidate.sourceContext)
            ? candidate.sourceContext
            : undefined,
        marks: marks && marks > 0 ? marks : DEFAULT_SHORT_ANSWER_MARKS
      };
    })
    .filter((question): question is QuestionPayload => question !== null);
};

export const quizService = {
  async generateQuiz(input: {
    materialId: string;
    title?: string;
    mcqCount: number;
    shortAnswerCount: number;
    userId: string;
  }) {
    const material = await prisma.material.findUnique({
      where: { id: input.materialId },
      include: {
        chunks: {
          orderBy: {
            orderIndex: "asc"
          }
        }
      }
    });

    if (!material || material.userId !== input.userId) {
      throw new AppError("Material not found", 404);
    }

    let questionsPayload: QuestionPayload[];

    if (groqService.isEnabled()) {
      try {
        const aiQuiz = await groqService.generateQuiz(
          material.extractedText,
          input.mcqCount,
          input.shortAnswerCount,
          input.title ?? `${material.title} Quiz`
        );
        questionsPayload = normalizeAiQuestions(aiQuiz.questions);

        const expectedCount = input.mcqCount + input.shortAnswerCount;

        if (questionsPayload.length !== expectedCount) {
          throw new Error("AI quiz response did not contain the expected number of valid questions");
        }
      } catch (error) {
        logger.error("Groq quiz generation failed, using fallback quiz generation", error);
        questionsPayload = fallbackQuiz(
          material.title,
          material.extractedText,
          material.chunks.map((chunk) => chunk.content),
          input.mcqCount,
          input.shortAnswerCount
        );
      }
    } else {
      questionsPayload = fallbackQuiz(
        material.title,
        material.extractedText,
        material.chunks.map((chunk) => chunk.content),
        input.mcqCount,
        input.shortAnswerCount
      );
    }

    try {
      return await prisma.quiz.create({
        data: {
          title: input.title ?? `${material.title} Quiz`,
          materialId: material.id,
          userId: input.userId,
          questions: {
            create: questionsPayload.map((question) => ({
              prompt: question.prompt,
              type: question.type === "MCQ" ? QuestionType.MCQ : QuestionType.SHORT_ANSWER,
              options: question.options ?? undefined,
              correctAnswer: question.correctAnswer,
              rubric: question.rubric ?? undefined,
              sourceContext: question.sourceContext ?? undefined,
              marks: question.marks
            }))
          }
        },
        include: {
          questions: true
        }
      });
    } catch (error) {
      logger.error("Quiz persistence failed", error);
      throw new AppError("Quiz generation failed", 500);
    }
  },

  listQuizzes(userId: string) {
    return prisma.quiz.findMany({
      where: {
        userId
      },
      include: {
        questions: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  },

  async getQuizById(quizId: string, userId: string) {
    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId, userId },
      include: {
        questions: true
      }
    });

    if (!quiz) {
      throw new AppError("Quiz not found", 404);
    }

    return quiz;
  }
};
