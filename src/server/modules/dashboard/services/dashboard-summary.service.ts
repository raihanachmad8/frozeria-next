import {
  countDashboardCategories,
  countDashboardItems,
  countDashboardLowStockItems,
  countDashboardOutOfStockItems,
} from "../repositories/dashboard.repository";

export interface DashboardSummaryDto {
  totalItems: number;
  totalCategories: number;
  lowStockItems: number;
  outOfStockItems: number;
  lowStockThreshold: number;
}

export async function getDashboardSummary(): Promise<DashboardSummaryDto> {
  const [totalItems, totalCategories, lowStockItems, outOfStockItems] = await Promise.all([
    countDashboardItems(),
    countDashboardCategories(),
    countDashboardLowStockItems(),
    countDashboardOutOfStockItems(),
  ]);

  return {
    totalItems,
    totalCategories,
    lowStockItems,
    outOfStockItems,
    lowStockThreshold: 20,
  };
}
