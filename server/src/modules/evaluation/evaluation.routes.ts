import { Router } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { validate } from "../../middleware/validate.middleware.js";
import { evaluationController } from "./evaluation.controller.js";
import { manualEvaluationSchema } from "./evaluation.schema.js";

export const evaluationRouter = Router();

evaluationRouter.post("/short-answer", validate(manualEvaluationSchema), asyncHandler(evaluationController.evaluateShortAnswer));
