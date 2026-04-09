import { createHmac, timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";

import { env } from "../../config/env.js";

const SESSION_COOKIE_NAME = "chronolearn_session";
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

type SessionPayload = {
  sub: string;
  iat: number;
  exp: number;
};

const sign = (value: string) => createHmac("sha256", env.SESSION_SECRET).update(value).digest("base64url");

const encodePayload = (payload: SessionPayload) => Buffer.from(JSON.stringify(payload)).toString("base64url");

const decodePayload = (value: string): SessionPayload | null => {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as SessionPayload;

    if (typeof parsed.sub !== "string" || typeof parsed.iat !== "number" || typeof parsed.exp !== "number") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const parseCookies = (cookieHeader?: string) => {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce<Record<string, string>>((cookies, part) => {
    const [rawName, ...rawValue] = part.trim().split("=");

    if (!rawName || rawValue.length === 0) {
      return cookies;
    }

    cookies[rawName] = decodeURIComponent(rawValue.join("="));
    return cookies;
  }, {});
};

export const sessionService = {
  createToken(userId: string) {
    const now = Date.now();
    const payload: SessionPayload = {
      sub: userId,
      iat: now,
      exp: now + SESSION_MAX_AGE_MS
    };
    const encodedPayload = encodePayload(payload);
    const signature = sign(encodedPayload);

    return `${encodedPayload}.${signature}`;
  },

  verifyToken(token: string): SessionPayload | null {
    const [encodedPayload, signature] = token.split(".");

    if (!encodedPayload || !signature) {
      return null;
    }

    const expectedSignature = sign(encodedPayload);
    const providedSignature = Buffer.from(signature, "base64url");
    const expectedSignatureBuffer = Buffer.from(expectedSignature, "base64url");

    if (providedSignature.length !== expectedSignatureBuffer.length) {
      return null;
    }

    if (!timingSafeEqual(providedSignature, expectedSignatureBuffer)) {
      return null;
    }

    const payload = decodePayload(encodedPayload);

    if (!payload || payload.exp <= Date.now()) {
      return null;
    }

    return payload;
  },

  getTokenFromRequest(req: Request) {
    const cookies = parseCookies(req.headers.cookie);
    return cookies[SESSION_COOKIE_NAME];
  },

  setSessionCookie(res: Response, token: string) {
    res.cookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      maxAge: SESSION_MAX_AGE_MS,
      path: "/"
    });
  },

  clearSessionCookie(res: Response) {
    res.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      path: "/"
    });
  }
};
