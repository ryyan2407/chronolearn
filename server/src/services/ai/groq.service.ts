import type { Prisma } from "@prisma/client";
import OpenAI from "openai";
import { z } from "zod";

import { env } from "../../config/env.js";
import {
  buildQuizPrompt,
  buildShortAnswerEvaluationPrompt,
  quizSystemPrompt,
  shortAnswerEvaluationSystemPrompt
} from "./promptBuilder.js";
import { extractTextContent, parseJsonResponse } from "./responseParsers.js";

type GeneratedQuestion = {
  type: "MCQ" | "SHORT_ANSWER";
  prompt: string;
  options?: string[];
  correctAnswer?: string;
  rubric?: Prisma.InputJsonValue;
  sourceContext?: Prisma.InputJsonValue;
  marks?: number;
};

type QuizGenerationResponse = {
  questions: GeneratedQuestion[];
};

type EvaluationResponse = {
  score: number;
  strengths: string[];
  missing_points: string[];
  feedback: string;
};

const quizGenerationSchema = z.object({
  questions: z.array(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("MCQ"),
        prompt: z.string().min(10),
        options: z.array(z.string().min(1)).length(4),
        correctAnswer: z.string().min(1)
      }),
      z.object({
        type: z.literal("SHORT_ANSWER"),
        prompt: z.string().min(10),
        rubric: z.record(z.string(), z.string().min(1)),
        sourceContext: z.union([z.array(z.string().min(1)).min(1), z.string().min(1)]),
        marks: z.number().int().positive().optional()
      })
    ])
  )
});

const evaluationSchema = z.object({
  score: z.number(),
  strengths: z.array(z.string()),
  missing_points: z.array(z.string()),
  feedback: z.string().min(1)
});

const clients = env.GROQ_API_KEYS.map(
  (apiKey) =>
    new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1"
    })
);

let nextClientIndex = 0;

const getClient = () => {
  if (clients.length === 0) {
    return null;
  }

  const client = clients[nextClientIndex % clients.length];
  nextClientIndex += 1;
  return client;
};

const requestJson = async <T>(
  systemPrompt: string,
  prompt: string,
  schema: z.ZodType<T>,
  label: string
): Promise<T> => {
  const client = getClient();

  if (!client) {
    throw new Error("GROQ_API_KEY or GROQ_API_KEYS is not configured");
  }

  const completion = await client.chat.completions.create({
    model: env.GROQ_MODEL,
    temperature: 0.2,
    response_format: {
      type: "json_object"
    },
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  const content = extractTextContent(completion.choices[0]?.message?.content);
  return parseJsonResponse<T>(content, schema, label);
};

export const groqService = {
  isEnabled(): boolean {
    return clients.length > 0;
  },
  generateQuiz(sourceText: string, mcqCount: number, shortAnswerCount: number, title: string) {
    return requestJson<QuizGenerationResponse>(
      quizSystemPrompt,
      buildQuizPrompt({ sourceText, mcqCount, shortAnswerCount, title }),
      quizGenerationSchema,
      "quiz response"
    );
  },
  evaluateShortAnswer(
    prompt: string,
    rubric: unknown,
    sourceContext: unknown,
    studentAnswer: string,
    marks: number
  ) {
    return requestJson<EvaluationResponse>(
      shortAnswerEvaluationSystemPrompt,
      buildShortAnswerEvaluationPrompt({ prompt, rubric, sourceContext, studentAnswer, marks }),
      evaluationSchema,
      "evaluation response"
    );
  }
};
