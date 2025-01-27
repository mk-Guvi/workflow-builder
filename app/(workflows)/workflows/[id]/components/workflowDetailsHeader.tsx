"use client";
import { useWorkflowStore } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";

import { toast } from "sonner";

const WorkflowDetailsHeader = () => {
  const pathname = usePathname();
  const { loading, workflowDetails, showSave, update, draftState } =
    useWorkflowStore();

  const [isSaving, setisSaving] = useState(false);

  const onSave = async () => {
    try {
      setisSaving(true);
      const response = await fetch(
        `/api/workflows/${workflowDetails?.id}/updateNodeAndEdges`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nodes: draftState.nodes,
            edges: draftState.edges,
          }),
        }
      );
      const data = await response.json();
      if (data?.error === false) {
        toast.message(data.message);
        update({ showSave: false, mainState: draftState });
      } else {
        if (data?.message) {
          toast.error(data.message);
        } else {
          throw new Error("Something went wrong");
        }
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to Save");
    } finally {
      setisSaving(false);
    }
  };
  const isExecugtionPage = useMemo(
    () => pathname?.includes("executions"),
    [pathname]
  );
  return (
    <div className="flex flex-row gap-6 flex-wrap min-h-16 items-center px-6 py-4 w-full dark:bg-black ">
      <div className="flex-1">
        {!workflowDetails?.name&&loading ? (
          <Skeleton className="w-full max-w-[15rem] h-8" />
        ) : (
          <h1
            className="font-semibold text-lg max-w-[20rem] truncate"
            title={workflowDetails?.name || ""}
          >
            {workflowDetails?.name || "Something went wrong"}
          </h1>
        )}
      </div>
      <div className="flex-1 flex justify-center items-center">
        <Tabs
          defaultValue="account"
          value={isExecugtionPage ? "executions" : "editor"}
        >
          <TabsList>
            <Link href={`/workflows/${workflowDetails?.id}`}>
              <TabsTrigger value="editor">Editor</TabsTrigger>
            </Link>
            <Link href={`/workflows/${workflowDetails?.id}/executions`}>
              <TabsTrigger value="executions">Executions</TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex flex-1 items-center min-w-[5rem] gap-2 justify-end">
        {isExecugtionPage ? null : loading || isSaving ? (
          <Skeleton className="w-full max-w-[5rem] h-8" />
        ) : showSave ? (
          <Button size={"sm"} onClick={onSave}>
            Save
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default WorkflowDetailsHeader;
