import { describe, expect, it } from "vitest";

import { AppError } from "@/server/http/errors";
import { readJsonBody } from "@/server/http/request";

describe("readJsonBody", () => {
  it("returns parsed JSON body", async () => {
    const request = new Request("http://localhost/api/v1/items", {
      method: "POST",
      body: JSON.stringify({ name: "Ayam nugget" }),
    });

    await expect(readJsonBody(request as never)).resolves.toEqual({ name: "Ayam nugget" });
  });

  it("throws an AppError for invalid JSON", async () => {
    const request = new Request("http://localhost/api/v1/items", {
      method: "POST",
      body: "{",
    });

    await expect(readJsonBody(request as never)).rejects.toMatchObject({
      status: 400,
      code: "INVALID_JSON_BODY",
    } satisfies Partial<AppError>);
  });
});
