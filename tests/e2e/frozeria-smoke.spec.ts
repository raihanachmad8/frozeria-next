import { expect, type APIResponse, test } from "@playwright/test";

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface Category {
  id: string;
  name: string;
}

interface Item {
  id: string;
  name: string;
}

const runId = Date.now();
const categoryName = `E2E Kategori ${runId}`;
const itemName = `E2E Barang ${runId}`;

let categoryId = "";
let itemId = "";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function parseApiResponse<T>(response: APIResponse): Promise<T> {
  const body = await response.text();

  expect(response.ok(), body).toBeTruthy();

  const payload = JSON.parse(body) as ApiEnvelope<T>;
  expect(payload.success, body).toBe(true);

  return payload.data;
}

test.describe.serial("Frozeria BNSP smoke flow", () => {
  test.beforeAll(async ({ request }) => {
    const category = await parseApiResponse<Category>(
      await request.post("/api/v1/categories", {
        data: {
          name: categoryName,
          description: "Kategori smoke test otomatis untuk validasi demo.",
        },
      }),
    );

    categoryId = category.id;

    const item = await parseApiResponse<Item>(
      await request.post("/api/v1/items", {
        data: {
          name: itemName,
          categoryId,
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

    itemId = item.id;
  });

  test.afterAll(async ({ request }) => {
    if (itemId) {
      await request.delete(`/api/v1/items/${itemId}`);
    }

    if (categoryId) {
      await request.delete(`/api/v1/categories/${categoryId}`);
    }
  });

  test("dashboard covers list, search, category filter, detail, add modal, and delete confirmation", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByText("Total barang")).toBeVisible();
    await expect(page.getByText("Total kategori")).toBeVisible();
    await expect(page.getByText("Stok menipis")).toBeVisible();
    await expect(page.getByText("Stok habis")).toBeVisible();
    await expect(page.getByText(itemName)).toBeVisible();

    await page.getByLabel("Pencarian barang").fill(itemName);
    await expect(page).toHaveURL(/q=/);
    await expect(page.getByText(itemName)).toBeVisible();

    await page.getByRole("combobox", { name: "Filter kategori barang" }).click();
    await page.getByTitle(categoryName).click();
    await expect(page).toHaveURL(/categoryId=/);
    await expect(page.getByText(itemName)).toBeVisible();

    await page.getByRole("button", { name: "Tambah Barang" }).click();
    const itemDialog = page.getByRole("dialog", { name: "Tambah barang" });
    await expect(itemDialog).toBeVisible();
    await expect(itemDialog.getByRole("textbox", { name: /Nama barang/ })).toBeVisible();
    await page.getByRole("button", { name: "Batal" }).click();

    await page.getByRole("button", { name: new RegExp(`Hapus barang ${escapeRegExp(itemName)}`) }).click();
    await expect(page.getByRole("dialog", { name: "Hapus barang?" })).toBeVisible();
    await page.getByRole("button", { name: "Batal" }).click();

    await page.getByRole("link", { name: new RegExp(`Detail barang ${escapeRegExp(itemName)}`) }).click();
    await expect(page).toHaveURL(new RegExp(`/items/${itemId}`));
    await expect(page.getByRole("heading", { name: "Detail barang" })).toBeVisible();
    await expect(page.getByText(itemName)).toBeVisible();
    await expect(page.getByLabel("Foto barang belum tersedia")).toBeVisible();
  });

  test("category page covers list, search, add modal, and delete confirmation", async ({ page }) => {
    await page.goto("/categories");

    await expect(page.getByRole("heading", { name: "Kategori" })).toBeVisible();
    await expect(page.getByText(categoryName)).toBeVisible();

    await page.getByLabel("Pencarian kategori").fill(categoryName);
    await expect(page).toHaveURL(/q=/);
    await expect(page.getByText(categoryName)).toBeVisible();

    await page.getByRole("button", { name: "Tambah Kategori" }).click();
    const categoryDialog = page.getByRole("dialog", { name: "Tambah kategori" });
    await expect(categoryDialog).toBeVisible();
    await expect(categoryDialog.getByRole("textbox", { name: /Nama kategori/ })).toBeVisible();
    await page.getByRole("button", { name: "Batal" }).click();

    await page.getByRole("button", { name: new RegExp(`Hapus kategori ${escapeRegExp(categoryName)}`) }).click();
    await expect(page.getByRole("dialog", { name: "Hapus kategori?" })).toBeVisible();
    await page.getByRole("button", { name: "Batal" }).click();
  });

  test("help page covers usage guide and participant identity labels", async ({ page }) => {
    await page.goto("/help");

    await expect(page.getByRole("heading", { name: "Bantuan" })).toBeVisible();
    await expect(page.getByText("Panduan Penggunaan Sistem")).toBeVisible();
    await expect(page.getByText("Cara menambah barang baru")).toBeVisible();
    await expect(page.getByText("Cara update stok barang masuk")).toBeVisible();
    await expect(page.getByText("Cara mengelola kategori")).toBeVisible();
    await expect(page.getByText("Identitas peserta")).toBeVisible();

    for (const label of ["Nama", "NIM", "Kelas", "Alamat", "Telepon", "Email"]) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });
});
