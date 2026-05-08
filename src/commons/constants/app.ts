export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Frozeria Stok";

export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "0.2.0";

export const APP_METADATA = {
  title: APP_NAME,
  description: "Frozen-food stock management application for a practical assessment demo.",
} as const;

export const APP_ACTIONS = {
  addItem: "Tambah Barang",
} as const;
