import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const splitKeys = (value?: string) =>
  value
    ?.split(",")
    .map((key) => key.trim())
    .filter(Boolean) ?? [];

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  SESSION_SECRET: z.string().min(32).default("chronolearn-dev-session-secret-keep-it-long"),
  GROQ_API_KEY: z.string().optional(),
  GROQ_API_KEYS: z.string().optional(),
  GROQ_MODEL: z.string().default("llama-3.3-70b-versatile"),
  CORS_ORIGINS: z.string().optional(),
  UPLOAD_DIR: z.string().default("uploads"),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().default(10)
});

const parsedEnv = envSchema.parse(process.env);

export const env = {
  ...parsedEnv,
  GROQ_API_KEYS: [...splitKeys(parsedEnv.GROQ_API_KEYS), ...splitKeys(parsedEnv.GROQ_API_KEY)],
  CORS_ORIGINS: splitKeys(parsedEnv.CORS_ORIGINS).length
    ? splitKeys(parsedEnv.CORS_ORIGINS)
    : ["http://localhost:5173"]
};
