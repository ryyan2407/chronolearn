import type { Request, Response } from "express";

import { authService } from "./auth.service.js";
import { sessionService } from "./session.service.js";

export const authController = {
  async register(req: Request, res: Response) {
    const response = await authService.register(req.body);
    sessionService.setSessionCookie(res, sessionService.createToken(response.user.id));
    res.status(201).json(response);
  },

  async login(req: Request, res: Response) {
    const response = await authService.login(req.body);
    sessionService.setSessionCookie(res, sessionService.createToken(response.user.id));
    res.status(200).json(response);
  },

  async me(req: Request, res: Response) {
    res.status(200).json({ user: req.authUser });
  },

  async logout(_req: Request, res: Response) {
    sessionService.clearSessionCookie(res);
    res.status(200).json({ success: true });
  }
};
