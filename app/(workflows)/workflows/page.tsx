import { Suspense } from "react";

import WorkflowGridSkeleton from "../components/WorkflowGridSkeleton";
import WorkflowGrid from "../components/WorkflowGrid";
import GlobalLayout from "@/components/globals/GlobalLayout";
import WorkflowListingHeader from "../components/headers/workflowListingHeader";

export default function Home() {
  return (
    <>
      <WorkflowListingHeader />
      <GlobalLayout>
        <main className="p-2 mx-auto">
          <Suspense fallback={<WorkflowGridSkeleton />}>
            <WorkflowGrid />
          </Suspense>
        </main>
      </GlobalLayout>
    </>
  );
}
