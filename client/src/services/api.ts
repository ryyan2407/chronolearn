import axios from "axios";

import type { ApiError } from "../types/api";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api",
  withCredentials: true
});

export function parseApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<ApiError>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
}
