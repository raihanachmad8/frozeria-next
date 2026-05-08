import { ZodError } from "zod";

import { AppError } from "./errors";
import { fail, ok } from "./response";

export async function handleApi<T>(handler: () => Promise<T> | T) {
  try {
    return ok(await handler());
  } catch (error) {
    if (error instanceof AppError) return fail(error.message, error.status);
    if (error instanceof ZodError) return fail(error.issues.map((issue) => issue.message).join(", "), 422);
    return fail(error instanceof Error ? error.message : "Unexpected server error", 500);
  }
}

