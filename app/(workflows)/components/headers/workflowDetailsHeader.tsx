"use client";
import { useWorkflowStore } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const WorkflowDetailsHeader = () => {
  const { loading, workflowDetails } = useWorkflowStore();
  return (
    <div className="flex flex-row gap-6 flex-wrap justify-between items-center px-6 py-4 w-full dark:bg-black ">
      {loading ? (
        <Skeleton className="w-full max-w-[15rem] h-[2rem]" />
      ) : (
        <h1
          className="font-semibold text-lg max-w-[20rem] truncate"
          title={workflowDetails?.name || ""}
        >
          {workflowDetails?.name || "Workflow Name Missing"}
        </h1>
      )}

      {loading ? (
        <Skeleton className="w-full max-w-[5rem] h-[2rem]" />
      ) : (
        <Button>Save</Button>
      )}
    </div>
  );
};

export default WorkflowDetailsHeader;
