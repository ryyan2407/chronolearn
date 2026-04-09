import { prisma } from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";
import type { AuthResponse, AuthUser } from "./auth.types.js";
import { hashPassword, verifyPassword } from "./password.service.js";

export const authService = {
  async register(input: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: input.email
      }
    });

    if (existingUser) {
      throw new AppError("An account with this email already exists", 409);
    }

    const passwordHash = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    return { user };
  },

  async login(input: { email: string; password: string }): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: {
        email: input.email
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        passwordHash: true
      }
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isLegacyPlaintextPassword = !user.passwordHash.includes(":");
    const isValidPassword = isLegacyPlaintextPassword
      ? input.password === user.passwordHash
      : await verifyPassword(input.password, user.passwordHash);

    if (!isValidPassword) {
      throw new AppError("Invalid email or password", 401);
    }

    if (isLegacyPlaintextPassword) {
      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          passwordHash: await hashPassword(input.password)
        }
      });
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;

    return {
      user: safeUser satisfies AuthUser
    };
  },

  getUserById(userId: string): Promise<AuthUser | null> {
    return prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
  }
};
