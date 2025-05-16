"use client";
import { useWorkflowStore } from "@/app/store";
import LoadingSpinner from "@/components/loaders/SpinnerLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeftSquareIcon,
  ChevronRightSquareIcon,
  RefreshCw,
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { WorkflowHistoryCard } from "./components/WorkflowHistoryCard";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { useChangeListener } from "@/hooks/debounceHook";

function LeftPanel() {
  const searchParams = useSearchParams();
  const [changeWatcher, recordChanges] = useChangeListener(500);
  const executionId = searchParams.get("e_id");
  const { id } = useParams();
  const {
    executionState: {
      current_page,
      total_pages,
      listLoading,
      listError,
      executions,
      page_size,
    },
    updateExecutionState,
  } = useWorkflowStore();

  const onChangePageSize = (value: string) => {
    updateExecutionState({ page_size: parseInt(value), current_page: 1 });
    recordChanges();
  };

  const getWorkflowHistory = async () => {
    if (isNaN(current_page)) {
      return;
    }
    updateExecutionState({ listLoading: true, listError: "" });
    try {
      const response = await fetch(
        `/api/workflows/${id}/executions?page_number=${current_page}&page_size=${page_size}`
      );
      const responseData = await response.json();

      if (responseData?.error === false) {
        updateExecutionState({
          executions: responseData?.data?.result || [],
          total_pages: responseData?.data?.total_pages,
          listLoading: false,
        });
      } else {
        if (responseData?.message) {
          updateExecutionState({
            listError: responseData?.message,
            executions: [],
            listLoading: false,
          });
        } else {
          throw new Error("Something went wrong");
        }
      }
    } catch (error) {
      console.error("Error fetching workflow history:", error);

      updateExecutionState({
        listError: "Something went wrong.Please try again.",
        total_pages: 0,
        total_count: 0,
        current_page: 1,
        executions: [],
      });
    }
  };

  useEffect(() => {
    getWorkflowHistory();
  }, [changeWatcher]);

  return (
    <div className="h-full  w-full flex flex-col">
      {total_pages >= 1 ? (
        <header className="flex items-center border-b text-xs p-3 flex-wrap sm:flex-nowrap  gap-2">
          <Button
            disabled={current_page <= 1}
            onClick={() => {
              updateExecutionState({ current_page: current_page - 1 });
              recordChanges();
            }}
            variant={"outline"}
            size={"xs"}
          >
            <ChevronLeftSquareIcon />
          </Button>

          <Input
            className="max-w-[3rem] h-7"
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value < 1 || value > total_pages) return;
              updateExecutionState({ current_page: value });
              recordChanges();
            }}
            value={current_page}
            type="number"
          />
          <div>/ {total_pages}</div>

          <Button
            disabled={current_page >= total_pages}
            variant={"outline"}
            size={"xs"}
            onClick={() => {
              updateExecutionState({ current_page: current_page + 1 });
              recordChanges();
            }}
          >
            <ChevronRightSquareIcon />
          </Button>
          <Select value={`${page_size}`} onValueChange={onChangePageSize}>
            <SelectTrigger className="w-[65px] h-7">
              <SelectValue placeholder="page size" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            disabled={listLoading}
            onClick={recordChanges}
            variant={"outline"}
            size={"xs"}
          >
            <RefreshCw />
          </Button>
        </header>
      ) : null}

      <main className="flex-1 h-full w-full pb-4 flex flex-col divide-y divide-neutral-200 gap-1 overflow-auto relative p-2 ">
        <LoadingSpinner isLoading={listLoading} />
        {listError ? (
          <h1 className="h-full text-center w-full flex items-center justify-center">
            {listError}
          </h1>
        ) : executions?.length ? (
          executions.map((each, i) => {
            return (
              <WorkflowHistoryCard
                key={`${each.id} - ${i}`}
                isActive={each.id === executionId}
                item={each}
              />
            );
          })
        ) : (
          <div className="h-full w-full flex items-center font-semibold justify-center">
            No Executions Found
          </div>
        )}
      </main>
    </div>
  );
}

export default LeftPanel;
