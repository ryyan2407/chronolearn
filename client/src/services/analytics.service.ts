import { api } from "./api";
import type { AnalyticsOverview } from "../types/api";

export const analyticsService = {
  async overview() {
    const { data } = await api.get<AnalyticsOverview>("/analytics/overview");
    return data;
  }
};
