"use client";
import { useWorkflowStore } from "@/app/store";
import LoadingSpinner from "@/components/loaders/SpinnerLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeftSquareIcon, ChevronRightSquareIcon, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { WorkflowHistoryCard } from "./components/WorkflowHistoryCard";

function LeftPanel() {
  const searchParams = useSearchParams();
  const executionId = searchParams.get("e_id");
  const {
    executionState: { current_page, total_pages, listLoading, listError, executions },
  } = useWorkflowStore();

  return (
    <div className="h-full  w-full flex flex-col">
      <header className="flex items-center justify-between border-b p-3  gap-1">
        <Button disabled={current_page === 1} variant={"outline"} size={"sm"}>
          <ChevronLeftSquareIcon />
        </Button>
        <div className="flex items-center gap-2">
          <Input className="max-w-[5rem]" value={current_page} type="number" />
          <span>/ {total_pages}</span>
        </div>
        <Button
          disabled={current_page >= total_pages}
          variant={"outline"}
          size={"sm"}
        >
          <ChevronRightSquareIcon />
        </Button>
        <Button
          disabled={listLoading}
          variant={"outline"}
          size={"sm"}
        >
          <RefreshCw/>
        </Button>


             </header>

      <main className="flex-1 h-full w-full pb-4 flex flex-col divide-y divide-neutral-200 gap-1 overflow-auto relative p-2 ">
        <LoadingSpinner isLoading={listLoading} />
        {listError ? (
          <h1 className="h-full text-center w-full flex items-center justify-center">
            {listError}
          </h1>
        ) : (
          executions.map((each,i) => {
            return (
              <WorkflowHistoryCard
                key={`${each.id} - ${i}`}
                isActive={each.id === executionId}
                item={each}
              />
            );
          })
        )}
      </main>
    </div>
  );
}

export default LeftPanel;
