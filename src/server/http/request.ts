import type { NextRequest } from "next/server";

import { AppError } from "./errors";

export async function readJsonBody(request: NextRequest): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new AppError("Request body must be valid JSON", 400, "INVALID_JSON_BODY");
  }
}
