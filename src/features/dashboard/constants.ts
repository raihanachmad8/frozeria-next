import type { ReactNode } from "react";

export const DASHBOARD_COPY = {
  title: "Dashboard",
  description: "Kelola stok makanan beku, kategori, dan status persediaan dari satu halaman.",
  inventoryTitle: "Daftar Barang",
  searchPlaceholder: "Cari nama barang...",
  allCategories: "Semua kategori",
  totalItems: "Total barang",
  totalCategories: "Total kategori",
  lowStock: "Stok menipis",
  outOfStock: "Stok habis",
} as const;

export interface DashboardStatPreview {
  icon: ReactNode;
  label: string;
  tone?: "teal" | "blue" | "amber" | "red";
  value: string;
}
