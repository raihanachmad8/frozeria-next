import type { NextRequest } from "next/server";
import { ZodError } from "zod";

import type { ApiErrorDetails } from "@/commons/types";

import { AppError } from "./errors";
import { dataResponse, errorResponse, isApiHandlerResult } from "./response";

interface HandleApiOptions {
  status?: number;
  message?: string;
  request?: NextRequest;
}

function zodErrorDetails(error: ZodError): ApiErrorDetails {
  return error.issues.reduce<ApiErrorDetails>(
    (details, issue) => {
      const key = issue.path.length > 0 ? issue.path.join(".") : "body";
      details[key] = [...(details[key] ?? []), issue.message];
      return details;
    },
    { code: "VALIDATION_ERROR" },
  );
}

export async function handleApi<T>(handler: () => Promise<T> | T, options?: HandleApiOptions) {
  const requestId = options?.request?.headers.get("x-request-id")?.trim() || undefined;

  try {
    const result = await handler();

    if (isApiHandlerResult<T>(result)) {
      return dataResponse(result.data, {
        status: options?.status,
        message: options?.message,
        requestId,
        pagination: result.pagination,
      });
    }

    return dataResponse(result, { status: options?.status, message: options?.message, requestId });
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse({
        status: error.status,
        message: error.message,
        code: error.code,
        details: error.details,
        requestId,
      });
    }

    if (error instanceof ZodError) {
      return errorResponse({
        status: 422,
        message: "Validation failed.",
        code: "VALIDATION_ERROR",
        details: zodErrorDetails(error),
        requestId,
      });
    }

    return errorResponse({
      status: 500,
      message: "An unexpected error occurred. Please try again later.",
      code: "INTERNAL_SERVER_ERROR",
      requestId,
    });
  }
}
