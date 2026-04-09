import pdf from "pdf-parse";

import { cleanText } from "./textCleaner.js";

export const parsePdfBuffer = async (buffer: Buffer): Promise<string> => {
  const result = await pdf(buffer);
  return cleanText(result.text);
};
