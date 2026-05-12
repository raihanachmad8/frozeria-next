import type { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { ZodError } from "zod";

import type { ApiErrorDetails } from "@/commons/types";

import { AppError } from "./errors";
import { dataResponse, errorResponse, isApiHandlerResult } from "./response";
import { logger } from "@/server/logger";

interface HandleApiOptions {
  status?: number;
  message?: string;
  request?: NextRequest;
}

interface ApiRouteContext extends Record<string, unknown> {
  durationMs: number;
  method?: string;
  pathname?: string;
  requestId: string;
  status: number;
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
  const startedAt = Date.now();
  const requestId = options?.request?.headers.get("x-request-id")?.trim() || randomUUID();
  const routeContext = options?.request
    ? {
        method: options.request.method,
        pathname: options.request.nextUrl.pathname,
        requestId,
      }
    : { requestId };

  function buildLogContext(status: number): ApiRouteContext {
    return {
      ...routeContext,
      status,
      durationMs: Date.now() - startedAt,
    };
  }

  try {
    const result = await handler();

    if (isApiHandlerResult<T>(result)) {
      const response = dataResponse(result.data, {
        status: options?.status,
        message: options?.message,
        requestId,
        pagination: result.pagination,
      });

      logger.info("API request completed.", buildLogContext(response.status));
      return response;
    }

    const response = dataResponse(result, { status: options?.status, message: options?.message, requestId });
    logger.info("API request completed.", buildLogContext(response.status));
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.status >= 500) {
        logger.error("API request failed with application error.", {
          ...buildLogContext(error.status),
          code: error.code,
          error,
        });
      } else {
        logger.warn("API request failed with application error.", {
          ...buildLogContext(error.status),
          code: error.code,
        });
      }

      return errorResponse({
        status: error.status,
        message: error.message,
        code: error.code,
        details: error.details,
        requestId,
      });
    }

    if (error instanceof ZodError) {
      logger.warn("API request validation failed.", {
        ...buildLogContext(422),
        issues: error.issues.map((issue) => ({
          path: issue.path.join(".") || "body",
          message: issue.message,
        })),
      });

      return errorResponse({
        status: 422,
        message: "Validation failed.",
        code: "VALIDATION_ERROR",
        details: zodErrorDetails(error),
        requestId,
      });
    }

    logger.error("API request failed with unexpected error.", {
      ...buildLogContext(500),
      error,
    });

    return errorResponse({
      status: 500,
      message: "An unexpected error occurred. Please try again later.",
      code: "INTERNAL_SERVER_ERROR",
      requestId,
    });
  }
}
