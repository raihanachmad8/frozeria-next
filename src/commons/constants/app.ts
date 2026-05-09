import { PUBLIC_ENV } from "./public-env";

export const APP_NAME = PUBLIC_ENV.appName;

export const APP_VERSION = PUBLIC_ENV.appVersion;

export const API_VERSION = "v1";

export const APP_METADATA = {
  title: APP_NAME,
  description: "Frozen-food stock management application for a practical assessment demo.",
} as const;

export const APP_ACTIONS = {
  addItem: "Tambah Barang",
} as const;
