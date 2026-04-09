import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validate } from "../../middleware/validate.middleware.js";
import { attemptsController } from "./attempts.controller.js";
import { submitAttemptSchema } from "./attempts.schema.js";

export const attemptsRouter = Router();

attemptsRouter.get("/", asyncHandler(requireAuth), asyncHandler(attemptsController.list));
attemptsRouter.get("/:attemptId", asyncHandler(requireAuth), asyncHandler(attemptsController.getById));
attemptsRouter.post(
  "/submit",
  asyncHandler(requireAuth),
  validate(submitAttemptSchema),
  asyncHandler(attemptsController.submit)
);
