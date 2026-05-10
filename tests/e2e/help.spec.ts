import { expect, test } from "@playwright/test";

test.describe("help module", () => {
  test("covers usage guide and participant identity labels", async ({ page }) => {
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
