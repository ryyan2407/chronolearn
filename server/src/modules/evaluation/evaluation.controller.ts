import type { Request, Response } from "express";

import { evaluationService } from "./evaluation.service.js";

export const evaluationController = {
  async evaluateShortAnswer(req: Request, res: Response) {
    const result = await evaluationService.evaluateShortAnswer(req.body);
    res.json(result);
  }
};
