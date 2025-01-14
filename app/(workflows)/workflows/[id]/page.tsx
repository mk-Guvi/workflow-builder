"use client";
import React, { useCallback, useState } from "react";
import WorkflowDetailsHeader from "../../components/headers/workflowDetailsHeader";
import GlobalLayout from "@/components/globals/GlobalLayout";
import { v4 } from "uuid";
import {
  applyNodeChanges,
  Background,
  Controls,
  NodeChange,
  ReactFlow,
  ReactFlowInstance,
  
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import GlobalDrawer from "@/components/globals/GlobalDrawer";
import NodesSidebar from "./components/NodesSidebar";
import { useDrawer } from "@/app/providers/drawerProvider";
import { AllNodesI, TNodeTypes } from "@/lib/types";
import { toast } from "sonner";
import CommonNode from "./components/CommonNode";
import { useWorkflowStore } from "@/app/store";

function EditorPage() {
  const { draftState, addNode, updateNodes } = useWorkflowStore();
  const { setOpen } = useDrawer();

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();

  const handleClick = () => {
    setOpen(
      <GlobalDrawer
        title="Workflow Nodes"
        subheading="Nodes are the Building blocks for the workflow."
        modal={false}
      >
        <NodesSidebar />
      </GlobalDrawer>
    );
  };

  const onDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      console.log("Im Here")
      event.preventDefault();

      const type: TNodeTypes = event.dataTransfer.getData(
        "application/reactflow"
      );

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const triggerAlreadyExists = draftState.nodes.find(
        (node) => node.type === "WEBHOOK_NODE"
      );

      if (type === "WEBHOOK_NODE" && triggerAlreadyExists) {
        toast("Only one Webhook can be added to automations at the moment");
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      if (!reactFlowInstance) return;
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      if (type === "WEBHOOK_NODE") {
        const node: AllNodesI = {
          id: v4(),
          type,
          position,
          data: {
            label: "Webhook Node",
          description: "",
          parameters: {
            path: v4(),
            respondType: "IMMEDIATELY",
            type: "GET",
          },
          settings:{
            allowMultipleHttps:false,
            notes:""
          }
          },
          
        };

        addNode(node);
      }
    },
    [reactFlowInstance, draftState]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      updateNodes(applyNodeChanges(changes, draftState.nodes) as AllNodesI[]);
    },
    [draftState.nodes]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

console.log({draftState})
  return (
    <>
      <WorkflowDetailsHeader />
      <GlobalLayout className="p-0">
        <div style={{ height: "100%", position: "relative" }}>
          <Button
            className="absolute top-2 right-4 z-50"
            variant={"outline"}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <PlusSquare />
          </Button>
          <ReactFlow
            onNodesChange={onNodesChange}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onInit={setReactFlowInstance}
            nodes={draftState.nodes}
            fitView
            edges={draftState.edges}
            nodeTypes={{
              "WEBHOOK_NODE":CommonNode,
              "WEBHOOK_RESPONSE_NODE":CommonNode,
              "CODE_NODE":CommonNode
            }}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </GlobalLayout>
    </>
  );
}

export default EditorPage;
