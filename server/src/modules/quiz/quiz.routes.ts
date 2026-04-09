import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validate } from "../../middleware/validate.middleware.js";
import { quizController } from "./quiz.controller.js";
import { generateQuizSchema } from "./quiz.schema.js";

export const quizRouter = Router();

quizRouter.get("/", asyncHandler(requireAuth), asyncHandler(quizController.list));
quizRouter.get("/:quizId", asyncHandler(requireAuth), asyncHandler(quizController.getById));
quizRouter.post("/generate", asyncHandler(requireAuth), validate(generateQuizSchema), asyncHandler(quizController.generate));
