import type { NextFunction, Request, Response } from "express";

import { authService } from "../modules/auth/auth.service.js";
import { sessionService } from "../modules/auth/session.service.js";
import { AppError } from "../utils/AppError.js";

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = sessionService.getTokenFromRequest(req);

  if (!token) {
    throw new AppError("Authentication required", 401);
  }

  const session = sessionService.verifyToken(token);

  if (!session) {
    sessionService.clearSessionCookie(res);
    throw new AppError("Session expired or invalid", 401);
  }

  const user = await authService.getUserById(session.sub);

  if (!user) {
    sessionService.clearSessionCookie(res);
    throw new AppError("Session expired or invalid", 401);
  }

  req.authUser = user;
  next();
};
