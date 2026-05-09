import type { NextRequest } from "next/server";

import { createCategory, listCategories } from "@/server/modules/categories";
import { readJsonBody } from "@/server/http/request";
import { handleApi } from "@/server/http/route";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  return handleApi(() =>
    listCategories({
      q: request.nextUrl.searchParams.get("q") ?? undefined,
    }),
  );
}

export async function POST(request: NextRequest) {
  return handleApi(async () => createCategory(await readJsonBody(request)), { status: 201 });
}
