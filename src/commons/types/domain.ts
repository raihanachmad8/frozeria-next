export interface CategorySummary {
  id: string;
  name: string;
}

export interface ItemListItem {
  id: string;
  name: string;
  category: CategorySummary | null;
  stock: number;
  unit: string;
  sellingPrice: number;
  photoUrl: string | null;
}

