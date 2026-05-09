import { APP_NAME } from "@/commons/constants";
import { handleApi } from "@/server/http/route";
import type { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  return handleApi(
    () => ({
      service: APP_NAME,
      status: "ok",
      timestamp: new Date().toISOString(),
    }),
    { request, message: "Service is live." },
  );
}
