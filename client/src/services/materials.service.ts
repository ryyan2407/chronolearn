import { api } from "./api";
import type { CreateTopicMaterialInput, Material } from "../types/material";

export const materialsService = {
  async list() {
    const { data } = await api.get<Material[]>("/materials");
    return data;
  },

  async createTopic(payload: CreateTopicMaterialInput) {
    const { data } = await api.post<Material>("/materials/topic", payload);
    return data;
  },

  async uploadPdf(formData: FormData) {
    const { data } = await api.post<Material>("/materials/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return data;
  }
};
