export const ROUTES = {
  dashboard: "/",
  itemsNew: "/items/new",
  categories: "/categories",
  categoryNew: "/categories/new",
  help: "/help",
} as const;

export const API_ENDPOINTS = {
  items: "/api/v1/items",
  categories: "/api/v1/categories",
  itemPhotoUpload: "/api/v1/uploads/item-photo",
  healthLive: "/api/v1/health/live",
  healthReady: "/api/v1/health/ready",
} as const;

