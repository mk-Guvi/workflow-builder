import { Suspense } from "react";

import WorkflowGridSkeleton from "../components/WorkflowGridSkeleton";
import WorkflowGrid from "../components/WorkflowGrid";

export default function Home() {
  return (
    <main className="p-2 mx-auto">
      <h1 className="text-2xl font-bold mb-6">Workflows</h1>
      <Suspense fallback={<WorkflowGridSkeleton />}>
        <WorkflowGrid />
      </Suspense>
    </main>
  );
}
