import { apiGet } from "@/lib/api";

import type { DashboardSummary } from "./types";

const DASHBOARD_SUMMARY_ENDPOINT = "/api/v1/dashboard/summary";

export function getDashboardSummary(): Promise<DashboardSummary> {
  return apiGet<DashboardSummary>(DASHBOARD_SUMMARY_ENDPOINT);
}
