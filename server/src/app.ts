import cors from "cors";
import express from "express";

import { analyticsRouter } from "./modules/analytics/analytics.routes.js";
import { attemptsRouter } from "./modules/attempts/attempts.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { env } from "./config/env.js";
import { evaluationRouter } from "./modules/evaluation/evaluation.routes.js";
import { materialsRouter } from "./modules/materials/materials.routes.js";
import { quizRouter } from "./modules/quiz/quiz.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

export const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGINS,
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/materials", materialsRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/attempts", attemptsRouter);
app.use("/api/evaluation", evaluationRouter);
app.use("/api/analytics", analyticsRouter);

app.use(errorMiddleware);
