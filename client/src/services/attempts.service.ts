import { api } from "./api";
import type { Attempt, SubmitAttemptInput } from "../types/attempt";

export const attemptsService = {
  async list() {
    const { data } = await api.get<Attempt[]>("/attempts");
    return data;
  },

  async getById(attemptId: string) {
    const { data } = await api.get<Attempt>(`/attempts/${attemptId}`);
    return data;
  },

  async submit(payload: SubmitAttemptInput) {
    const { data } = await api.post<Attempt>("/attempts/submit", payload);
    return data;
  }
};
