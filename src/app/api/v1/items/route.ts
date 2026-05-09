import type { NextRequest } from "next/server";

import { createItem, listItems } from "@/server/modules/items";
import { readJsonBody } from "@/server/http/request";
import { handleApi } from "@/server/http/route";
import { apiResult } from "@/server/http/response";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  return handleApi(
    async () => {
      const result = await listItems({
        q: request.nextUrl.searchParams.get("q") ?? undefined,
        categoryId: request.nextUrl.searchParams.get("categoryId") ?? undefined,
        page: request.nextUrl.searchParams.get("page") ?? undefined,
        pageSize: request.nextUrl.searchParams.get("pageSize") ?? undefined,
        sortBy: request.nextUrl.searchParams.get("sortBy") ?? undefined,
        sortDirection: request.nextUrl.searchParams.get("sortDirection") ?? undefined,
      });

      return apiResult(result.items, { pagination: result.pagination });
    },
    { request, message: "Items retrieved successfully." },
  );
}

export async function POST(request: NextRequest) {
  return handleApi(async () => createItem(await readJsonBody(request)), {
    request,
    status: 201,
    message: "Item created successfully.",
  });
}
