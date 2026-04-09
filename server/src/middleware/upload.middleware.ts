import multer from "multer";

import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.MAX_UPLOAD_SIZE_MB * 1024 * 1024
  },
  fileFilter: (_req, file, callback) => {
    const isPdf = file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      callback(new AppError("Only PDF files are supported.", 400, "INVALID_FILE_TYPE"));
      return;
    }

    callback(null, true);
  }
});
