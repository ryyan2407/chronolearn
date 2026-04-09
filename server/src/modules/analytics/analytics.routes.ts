import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { analyticsController } from "./analytics.controller.js";

export const analyticsRouter = Router();

analyticsRouter.get("/overview", asyncHandler(requireAuth), asyncHandler(analyticsController.overview));
