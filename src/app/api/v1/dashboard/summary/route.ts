import type { NextRequest } from "next/server";

import { handleApi } from "@/server/http/route";
import { getDashboardSummary } from "@/server/modules/dashboard";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  return handleApi(async () => getDashboardSummary(), {
    request,
    message: "Dashboard summary retrieved successfully.",
  });
}
