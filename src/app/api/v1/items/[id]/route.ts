import type { NextRequest } from "next/server";

import { deleteItem, getItemById, updateItem } from "@/server/modules/items";
import { readJsonBody } from "@/server/http/request";
import { handleApi } from "@/server/http/route";

export const runtime = "nodejs";

interface ItemRouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: ItemRouteContext) {
  const { id } = await context.params;
  return handleApi(() => getItemById(id), { request, message: "Item retrieved successfully." });
}

export async function PUT(request: NextRequest, context: ItemRouteContext) {
  const { id } = await context.params;
  return handleApi(async () => updateItem(id, await readJsonBody(request)), {
    request,
    message: "Item updated successfully.",
  });
}

export async function DELETE(request: NextRequest, context: ItemRouteContext) {
  const { id } = await context.params;
  return handleApi(async () => deleteItem(id), { request, message: "Item deleted successfully." });
}
