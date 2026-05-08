import { checkDatabase, checkDatabaseSchema } from "@/server/db/client";
import { handleApi } from "@/server/http/route";

export async function GET() {
  return handleApi(async () => {
    const database = await checkDatabase();
    const schema = await checkDatabaseSchema();

    return {
      status: database.ok && schema.ok ? "ready" : "not_ready",
      database,
      schema,
      timestamp: new Date().toISOString(),
    };
  });
}
