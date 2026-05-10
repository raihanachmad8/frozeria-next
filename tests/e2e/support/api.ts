import { expect, type APIResponse, type APIRequestContext } from "@playwright/test";

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export interface CategoryFixture {
  id: string;
  name: string;
}

export interface ItemFixture {
  id: string;
  name: string;
}

export interface InventoryFixture {
  category: CategoryFixture;
  item: ItemFixture;
}

async function parseApiResponse<T>(response: APIResponse): Promise<T> {
  const body = await response.text();

  expect(response.ok(), body).toBeTruthy();

  const payload = JSON.parse(body) as ApiEnvelope<T>;
  expect(payload.success, body).toBe(true);

  return payload.data;
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function createInventoryFixture(request: APIRequestContext, moduleName: string): Promise<InventoryFixture> {
  const runId = `${moduleName}-${Date.now()}`;
  const categoryName = `E2E Kategori ${runId}`;
  const itemName = `E2E Barang ${runId}`;

  const category = await parseApiResponse<CategoryFixture>(
    await request.post("/api/v1/categories", {
      data: {
        name: categoryName,
        description: "Kategori smoke test otomatis untuk validasi demo.",
      },
    }),
  );

  const item = await parseApiResponse<ItemFixture>(
    await request.post("/api/v1/items", {
      data: {
        name: itemName,
        categoryId: category.id,
        stock: 12,
        minimumStock: 20,
        unit: "pcs",
        packageSize: "500 gram",
        purchasePrice: 12000,
        sellingPrice: 18000,
        storageLocation: "Freezer E2E",
        description: "Barang smoke test otomatis untuk validasi demo.",
      },
    }),
  );

  return { category, item };
}

export async function deleteInventoryFixture(
  request: APIRequestContext,
  fixture: Partial<InventoryFixture> | undefined,
): Promise<void> {
  if (fixture?.item?.id) {
    await request.delete(`/api/v1/items/${fixture.item.id}`);
  }

  if (fixture?.category?.id) {
    await request.delete(`/api/v1/categories/${fixture.category.id}`);
  }
}
