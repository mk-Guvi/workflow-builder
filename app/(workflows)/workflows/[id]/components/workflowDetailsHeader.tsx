"use client";
import { useWorkflowStore } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect } from "react";

const WorkflowDetailsHeader = () => {
  const { loading, workflowDetails,   showSave, update } =
    useWorkflowStore();

  useEffect(() => {
    if (showSave) {
      update({ showSave: false });
    }
  }, [showSave]);

  

  return (
    <div className="flex flex-row gap-6 flex-wrap justify-between items-center px-6 py-4 w-full dark:bg-black ">
      {loading ? (
        <Skeleton className="w-full max-w-[15rem] h-[2rem]" />
      ) : (
        <h1
          className="font-semibold text-lg max-w-[20rem] truncate"
          title={workflowDetails?.name || ""}
        >
          {workflowDetails?.name || "Something went wrong"}
        </h1>
      )}

      {loading ? (
        <Skeleton className="w-full max-w-[5rem] h-[2rem]" />
      ) : showSave ? (
        <Button>Save</Button>
      ) : null}
    </div>
  );
};

export default WorkflowDetailsHeader;
