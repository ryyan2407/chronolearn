import type { ZodType } from "zod";

import { AppError } from "../../utils/AppError.js";

const tryParseJson = (value: string) => {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
};

const extractFencedJson = (content: string) => {
  const match = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return match?.[1]?.trim() ?? null;
};

const extractFirstJsonBlock = (content: string) => {
  const openingIndex = content.search(/[\[{]/);

  if (openingIndex === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = openingIndex; index < content.length; index += 1) {
    const char = content[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === "{" || char === "[") {
      depth += 1;
    }

    if (char === "}" || char === "]") {
      depth -= 1;

      if (depth === 0) {
        return content.slice(openingIndex, index + 1).trim();
      }
    }
  }

  return null;
};

export const parseJsonResponse = <T>(content: string, schema: ZodType<T>, label = "model response"): T => {
  const candidates = [
    content.trim(),
    extractFencedJson(content),
    extractFirstJsonBlock(content)
  ].filter((candidate): candidate is string => Boolean(candidate));

  for (const candidate of candidates) {
    const parsed = tryParseJson(candidate);

    if (parsed === null) {
      continue;
    }

    const validated = schema.safeParse(parsed);

    if (validated.success) {
      return validated.data;
    }
  }

  throw new AppError(`Model returned invalid ${label} JSON`, 502);
};

export const extractTextContent = (content: string | null | undefined) => {
  const normalized = content?.trim();

  if (!normalized) {
    throw new AppError("Model returned empty content", 502);
  }

  return normalized;
};
