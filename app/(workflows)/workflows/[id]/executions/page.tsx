"use client";
import GlobalLayout from "@/components/globals/GlobalLayout";
import React, { useEffect } from "react";
import WorkflowDetailsHeader from "../components/workflowDetailsHeader";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Background, Controls, ReactFlow } from "@xyflow/react";
import CommonNode from "../components/CommonNode";
import CustomEdge from "../components/CustomEdge";
import LeftPanel from "./LeftPanel";
import { useWorkflowStore } from "@/app/store";
import { useParams, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/loaders/SpinnerLoader";

function ExecutionsPage() {
  const { updateExecutionState, executionState, update } = useWorkflowStore();
  const searchParams = useSearchParams();
  const executionId = searchParams.get("e_id");
  const { id } = useParams();

  useEffect(() => {
    update({
      nodesData: {},
    });
    updateExecutionState({
      detailError: "",
      executionsDetails: {
        edges: [],
        nodes: [],
      },
    });
    if (executionId && id) {
      getWorkflowHistoryDetails();
    }
  }, [executionId, id]);

  const getWorkflowHistoryDetails = async () => {
    try {
      updateExecutionState({
        detailLoading: true,
      });
      const response = await fetch(
        `/api/workflows/${id}/executions/${executionId}`
      );
      const data = await response.json();
      if (data?.error === false) {
        updateExecutionState({
          detailLoading: false,
          executionsDetails: {
            edges: data?.edges || [],
            nodes: data?.nodes || [],
          },
        });
      } else {
        if (data?.message) {
          updateExecutionState({
            detailLoading: false,
            detailError: data?.message,
            executionsDetails: {
              edges: [],
              nodes: [],
            },
          });
        } else {
          throw new Error("Something went wrong");
        }
      }
    } catch (error) {
      console.log(error);
      updateExecutionState({
        detailError: "Something went wrong.Please try again later.",
        detailLoading: false,
        executionsDetails: {
          edges: [],
          nodes: [],
        },
      });
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <WorkflowDetailsHeader />
      <GlobalLayout className="!p-0 flex-1 !h-full !overflow-auto">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={25}>
            <LeftPanel />
          </ResizablePanel>
          <ResizablePanel className="border-l relative" defaultSize={75}>
            <LoadingSpinner isLoading={executionState.detailLoading} />
            <ReactFlow
              nodes={executionState.executionsDetails.nodes}
              edgeTypes={{
                default: CustomEdge,
              }}
              edges={executionState.executionsDetails.edges}
              nodeTypes={{
                WEBHOOK_NODE: CommonNode,
                WEBHOOK_RESPONSE_NODE: CommonNode,
                CODE_NODE: CommonNode,
              }}
            >
              <Background />
              <Controls position="top-left" />
            </ReactFlow>
          </ResizablePanel>
        </ResizablePanelGroup>
      </GlobalLayout>
    </div>
  );
}

export default ExecutionsPage;
