import type { Request, Response } from "express";
import type { z } from "zod";

import { AppError } from "../../utils/AppError.js";
import { generateQuizSchema } from "./quiz.schema.js";
import { quizService } from "./quiz.service.js";

export const quizController = {
  async generate(req: Request<{}, {}, z.infer<typeof generateQuizSchema>>, res: Response) {
    const quiz = await quizService.generateQuiz({
      ...req.body,
      userId: req.authUser!.id
    });
    res.status(201).json(quiz);
  },

  async list(req: Request, res: Response) {
    const quizzes = await quizService.listQuizzes(req.authUser!.id);
    res.json(quizzes);
  },

  async getById(req: Request, res: Response) {
    const { quizId } = req.params as { quizId: string };
    const quiz = await quizService.getQuizById(quizId, req.authUser!.id);

    res.json(quiz);
  }
};
