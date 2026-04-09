import { api } from "./api";
import type { AuthResponse, LoginInput, RegisterInput } from "../types/auth";

export const authService = {
  async login(payload: LoginInput) {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  async register(payload: RegisterInput) {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  },

  async me() {
    const { data } = await api.get<AuthResponse>("/auth/me");
    return data;
  },

  async logout() {
    const { data } = await api.post<{ success: boolean }>("/auth/logout");
    return data;
  }
};
