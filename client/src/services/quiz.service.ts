import { api } from "./api";
import type { GenerateQuizInput, Quiz } from "../types/quiz";

export const quizService = {
  async list() {
    const { data } = await api.get<Quiz[]>("/quiz");
    return data;
  },

  async getById(quizId: string) {
    const { data } = await api.get<Quiz>(`/quiz/${quizId}`);
    return data;
  },

  async generate(payload: GenerateQuizInput) {
    const { data } = await api.post<Quiz>("/quiz/generate", payload);
    return data;
  }
};
