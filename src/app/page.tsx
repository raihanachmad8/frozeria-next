import { Suspense } from "react";

import { DashboardPage } from "@/features/dashboard/dashboard-page";

export default function Home() {
  return (
    <Suspense>
      <DashboardPage />
    </Suspense>
  );
}
