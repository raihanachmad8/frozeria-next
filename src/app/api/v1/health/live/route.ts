import { APP_NAME } from "@/commons/constants";
import { handleApi } from "@/server/http/route";

export function GET() {
  return handleApi(() => ({
    service: APP_NAME,
    status: "ok",
    timestamp: new Date().toISOString(),
  }));
}
