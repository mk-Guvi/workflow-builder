"use client";
import GlobalLayout from "@/components/globals/GlobalLayout";
import React from "react";
import WorkflowDetailsHeader from "../components/workflowDetailsHeader";
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Background, Controls, ReactFlow } from "@xyflow/react";
import CommonNode from "../components/CommonNode";
import CustomEdge from "../components/CustomEdge";
import LeftPanel from "./LeftPanel";

function ExecutionsPage() {
  return (
    <div className="h-full w-full flex flex-col">
      <WorkflowDetailsHeader />
      <GlobalLayout className="!p-0 flex-1 !h-full !overflow-auto">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={25}><LeftPanel/></ResizablePanel>
          <ResizablePanel className="border-l" defaultSize={75}>
            <ReactFlow
              nodes={[]}
              edgeTypes={{
                default: CustomEdge,
              }}
              edges={[]}
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
