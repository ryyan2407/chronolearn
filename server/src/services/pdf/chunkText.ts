import { DEFAULT_CHUNK_SIZE } from "../../utils/constants.js";

export const chunkText = (text: string, chunkSize = DEFAULT_CHUNK_SIZE): string[] => {
  if (!text.trim()) {
    return [];
  }

  const chunks: string[] = [];
  for (let index = 0; index < text.length; index += chunkSize) {
    chunks.push(text.slice(index, index + chunkSize));
  }

  return chunks;
};
