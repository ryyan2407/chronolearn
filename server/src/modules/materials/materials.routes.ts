import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { upload } from "../../middleware/upload.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { materialsController } from "./materials.controller.js";
import { createTopicMaterialSchema } from "./materials.schema.js";

export const materialsRouter = Router();

materialsRouter.get("/", asyncHandler(requireAuth), asyncHandler(materialsController.list));
materialsRouter.post(
  "/topic",
  asyncHandler(requireAuth),
  validate(createTopicMaterialSchema),
  asyncHandler(materialsController.createTopic)
);
materialsRouter.post("/upload", asyncHandler(requireAuth), upload.single("file"), asyncHandler(materialsController.uploadPdf));
