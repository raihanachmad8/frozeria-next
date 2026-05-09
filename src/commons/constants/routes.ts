export const ROUTES = {
  dashboard: "/",
  dashboardCreateItem: "/?itemAction=create",
  itemDetail: (id: string) => `/items/${id}`,
  itemsNew: "/items/new",
  categories: "/categories",
  categoryNew: "/categories/new",
  help: "/help",
} as const;

export const API_ENDPOINTS = {
  items: "/api/v1/items",
  categories: "/api/v1/categories",
  dashboardSummary: "/api/v1/dashboard/summary",
  itemPhotoUpload: "/api/v1/uploads/item-photo",
  healthLive: "/api/v1/health/live",
  healthReady: "/api/v1/health/ready",
} as const;
