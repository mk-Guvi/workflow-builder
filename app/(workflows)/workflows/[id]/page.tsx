"use client";
import React from "react";
import WorkflowDetailsHeader from "../../components/headers/workflowDetailsHeader";
import GlobalLayout from "@/components/globals/GlobalLayout";
import { Background, Controls, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import GlobalDrawer from "@/components/globals/GlobalDrawer";
import NodesSidebar from "./components/NodesSidebar";
import { useDrawer } from "@/app/providers/drawerProvider";

function EditorPage() {

  const { setOpen } = useDrawer();

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
              handleClick()
            }}
          >
            <PlusSquare />
          </Button>
          <ReactFlow>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </GlobalLayout>
    </>
  );
}

export default EditorPage;
