"use client";
import { useWorkflowStore } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import React, {  useState } from "react";
import { toast } from "sonner";

const WorkflowDetailsHeader = () => {
  const { loading, workflowDetails, showSave, update ,draftState} = useWorkflowStore();
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
          body: JSON.stringify({ nodes: draftState.nodes, edges: draftState.edges }),
        }
      );
      const data = await response.json();
      if (data?.error === false) {
        toast.message(data.message);
        update({ showSave: false ,mainState: draftState});
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
    }finally{
      setisSaving(false);
    }
  };

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

      {loading || isSaving ? (
        <Skeleton className="w-full max-w-[5rem] h-[2rem]" />
      ) : showSave ? (
        <Button onClick={onSave}>Save</Button>
      ) : null}
    </div>
  );
};

export default WorkflowDetailsHeader;
