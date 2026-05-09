"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardSummary } from "./api";
import { dashboardKeys } from "./keys";

export function useDashboardSummaryQuery() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: getDashboardSummary,
  });
}
