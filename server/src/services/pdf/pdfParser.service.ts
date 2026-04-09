import pdf from "pdf-parse";

import { AppError } from "../../utils/AppError.js";
import { cleanText } from "./textCleaner.js";

export const parsePdfBuffer = async (buffer: Buffer): Promise<string> => {
  try {
    const result = await pdf(buffer);
    return cleanText(result.text);
  } catch {
    throw new AppError("The uploaded PDF could not be parsed. Try a different file.", 400, "PDF_PARSE_FAILED");
  }
};
