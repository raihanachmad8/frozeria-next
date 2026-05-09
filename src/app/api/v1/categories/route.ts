import type { NextRequest } from "next/server";

import { createCategory, listCategories } from "@/server/modules/categories";
import { readJsonBody } from "@/server/http/request";
import { handleApi } from "@/server/http/route";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  return handleApi(
    () =>
      listCategories({
        q: request.nextUrl.searchParams.get("q") ?? undefined,
      }),
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
