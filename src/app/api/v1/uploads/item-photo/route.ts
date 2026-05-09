import type { NextRequest } from "next/server";

import { handleApi } from "@/server/http/route";
import { uploadItemPhoto } from "@/server/modules/uploads";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  return handleApi(async () => uploadItemPhoto(await request.formData()), {
    request,
    status: 201,
    message: "Item photo uploaded successfully.",
  });
}
