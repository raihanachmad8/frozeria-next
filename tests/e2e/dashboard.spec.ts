import { expect, test } from "@playwright/test";

import { createInventoryFixture, deleteInventoryFixture, escapeRegExp, type InventoryFixture } from "./support/api";

test.describe.serial("dashboard module", () => {
  let fixture: InventoryFixture | undefined;

  test.beforeAll(async ({ request }) => {
    fixture = await createInventoryFixture(request, "dashboard");
  });

  test.afterAll(async ({ request }) => {
    await deleteInventoryFixture(request, fixture);
  });

  test("covers list, search, category filter, detail, add modal, and delete confirmation", async ({ page }) => {
    const itemName = fixture!.item.name;
    const categoryName = fixture!.category.name;

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
    await expect(page).toHaveURL(new RegExp(`/items/${fixture!.item.id}`));
    await expect(page.getByRole("heading", { name: "Detail barang" })).toBeVisible();
    await expect(page.getByText(itemName)).toBeVisible();
    await expect(page.getByLabel("Foto barang belum tersedia")).toBeVisible();
  });
});
