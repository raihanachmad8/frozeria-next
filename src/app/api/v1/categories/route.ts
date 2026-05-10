import type { NextRequest } from "next/server";

import { createCategory, listCategories } from "@/server/modules/categories";
import { readJsonBody } from "@/server/http/request";
import { handleApi } from "@/server/http/route";
import { apiResult } from "@/server/http/response";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  return handleApi(
    async () => {
      const result = await listCategories({
        q: request.nextUrl.searchParams.get("q") ?? undefined,
        page: request.nextUrl.searchParams.get("page") ?? undefined,
        pageSize: request.nextUrl.searchParams.get("pageSize") ?? undefined,
      });

      return apiResult(result.categories, { pagination: result.pagination });
    },
    { request, message: "Categories retrieved successfully." },
  );
}

export async function POST(request: NextRequest) {
  return handleApi(async () => createCategory(await readJsonBody(request)), {
    request,
    status: 201,
    message: "Category created successfully.",
  });
}
