import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  countDashboardCategories,
  countDashboardItems,
  countDashboardLowStockItems,
  countDashboardOutOfStockItems,
} from "@/server/modules/dashboard/repositories/dashboard.repository";
import { getDashboardSummary } from "@/server/modules/dashboard/services/dashboard-summary.service";

vi.mock("@/server/modules/dashboard/repositories/dashboard.repository", () => ({
  countDashboardItems: vi.fn(),
  countDashboardCategories: vi.fn(),
  countDashboardLowStockItems: vi.fn(),
  countDashboardOutOfStockItems: vi.fn(),
}));

describe("getDashboardSummary", () => {
  beforeEach(() => {
    vi.mocked(countDashboardItems).mockResolvedValue(48);
    vi.mocked(countDashboardCategories).mockResolvedValue(5);
    vi.mocked(countDashboardLowStockItems).mockResolvedValue(9);
    vi.mocked(countDashboardOutOfStockItems).mockResolvedValue(4);
  });

  it("returns database-backed dashboard counts and the fixed low-stock threshold", async () => {
    await expect(getDashboardSummary()).resolves.toEqual({
      totalItems: 48,
      totalCategories: 5,
      lowStockItems: 9,
      outOfStockItems: 4,
      lowStockThreshold: 20,
    });
  });
});
