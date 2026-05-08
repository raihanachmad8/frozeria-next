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
  showingItems: "Menampilkan",
  itemSuffix: "barang",
} as const;

export const DASHBOARD_TABLE_COPY = {
  itemName: "Nama barang",
  category: "Kategori",
  stock: "Stok",
  unit: "Satuan",
  sellingPrice: "Harga jual",
  actions: "Aksi",
} as const;

export const DASHBOARD_ACTIONS = {
  detail: "Detail",
  edit: "Edit",
  delete: "Hapus",
} as const;

export const DASHBOARD_CATEGORY_OPTIONS = [
  { label: DASHBOARD_COPY.allCategories, value: "all" },
  { label: "Ayam", value: "ayam" },
  { label: "Sapi", value: "sapi" },
  { label: "Seafood", value: "seafood" },
  { label: "Sayuran", value: "sayuran" },
] as const;

export interface DashboardItemPreview {
  key: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  sellingPrice: string;
}

export interface DashboardStatPreview {
  icon: ReactNode;
  label: string;
  tone?: "teal" | "blue" | "amber" | "red";
  value: string;
}

export const DASHBOARD_ITEM_PREVIEWS: DashboardItemPreview[] = [
  {
    key: "1",
    name: "Ayam nugget crispy",
    category: "Ayam",
    stock: 120,
    unit: "pcs",
    sellingPrice: "Rp 35.000",
  },
  {
    key: "2",
    name: "Sosis sapi premium",
    category: "Sapi",
    stock: 15,
    unit: "pack",
    sellingPrice: "Rp 28.000",
  },
  {
    key: "3",
    name: "Dim sum udang",
    category: "Seafood",
    stock: 0,
    unit: "box",
    sellingPrice: "Rp 45.000",
  },
];
