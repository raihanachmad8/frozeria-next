import { Suspense } from "react";

import { CategoryPage } from "@/features/categories/category-page";

export default function CategoriesPage() {
  return (
    <Suspense>
      <CategoryPage />
    </Suspense>
  );
}
