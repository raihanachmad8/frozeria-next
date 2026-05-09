import type { ApiErrorDetails } from "@/commons/types";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
    public readonly code?: string,
    public readonly details?: ApiErrorDetails,
  ) {
    super(message);
  }
}
