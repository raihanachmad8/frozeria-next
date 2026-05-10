import { expect, test } from "@playwright/test";

import { createInventoryFixture, deleteInventoryFixture, escapeRegExp, type InventoryFixture } from "./support/api";

test.describe.serial("categories module", () => {
  let fixture: InventoryFixture | undefined;

  test.beforeAll(async ({ request }) => {
    fixture = await createInventoryFixture(request, "categories");
  });

  test.afterAll(async ({ request }) => {
    await deleteInventoryFixture(request, fixture);
  });

  test("covers list, search, add modal, and delete confirmation", async ({ page }) => {
    const categoryName = fixture!.category.name;

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
});
