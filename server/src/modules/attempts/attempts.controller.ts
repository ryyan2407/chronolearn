import type { Request, Response } from "express";

import { attemptsService } from "./attempts.service.js";

export const attemptsController = {
  async submit(req: Request, res: Response) {
    const attempt = await attemptsService.submitAttempt({
      ...req.body,
      userId: req.authUser!.id
    });
    res.status(201).json(attempt);
  },

  async list(req: Request, res: Response) {
    const attempts = await attemptsService.listAttempts(req.authUser!.id);
    res.json(attempts);
  },

  async getById(req: Request, res: Response) {
    const { attemptId } = req.params as { attemptId: string };
    const attempt = await attemptsService.getAttemptById(attemptId, req.authUser!.id);
    res.json(attempt);
  }
};
