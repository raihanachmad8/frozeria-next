import type { NextRequest } from "next/server";

import { deleteCategory, getCategoryById, updateCategory } from "@/server/modules/categories";
import { readJsonBody } from "@/server/http/request";
import { handleApi } from "@/server/http/route";

export const runtime = "nodejs";

interface CategoryRouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: NextRequest, context: CategoryRouteContext) {
  const { id } = await context.params;
  return handleApi(() => getCategoryById(id));
}

export async function PUT(request: NextRequest, context: CategoryRouteContext) {
  const { id } = await context.params;
  return handleApi(async () => updateCategory(id, await readJsonBody(request)));
}

export async function DELETE(_request: NextRequest, context: CategoryRouteContext) {
  const { id } = await context.params;
  return handleApi(async () => deleteCategory(id));
}
