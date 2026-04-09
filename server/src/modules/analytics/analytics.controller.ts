import type { Request, Response } from "express";

import { analyticsService } from "./analytics.service.js";

export const analyticsController = {
  async overview(req: Request, res: Response) {
    const result = await analyticsService.getOverview(req.authUser!.id);
    res.json(result);
  }
};
