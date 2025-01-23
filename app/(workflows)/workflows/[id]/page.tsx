"use client";
import React, { useCallback, useEffect, useState } from "react";
import WorkflowDetailsHeader from "./components/workflowDetailsHeader";
import GlobalLayout from "@/components/globals/GlobalLayout";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  NodeChange,
  ReactFlow,
  ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { PlusSquare } from "lucide-react";
import GlobalDrawer from "@/components/globals/GlobalDrawer";
import NodesSidebar from "./components/NodesSidebar";
import { useDrawer } from "@/app/providers/drawerProvider";
import { AllNodesI, TNodeTypes } from "@/lib/types";
import { toast } from "sonner";
import CommonNode from "./components/CommonNode";
import { useWorkflowStore } from "@/app/store";
import CustomEdge from "./components/CustomEdge";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/loaders/SpinnerLoader";
import { useChangeListener } from "@/hooks/debounceHook";

function EditorPage() {
  const router = useRouter();
  const {
    draftState,
    addNode,
    updateNodes,
    update,
    workflowDetails,
    loading,
    error,
  } = useWorkflowStore();

  const { id } = useParams();
  const { setOpen } = useDrawer();

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();

  const onInit = async () => {
    try {
      update({ loading: true, error: "" });
      const response = await fetch(`/api/workflows/${id}`);
      const data = await response.json();
      if (response?.status === 404) {
        toast.error(data.message);
        router.push("/workflows");
        return;
      } else if (response?.status === 200) {
        update({
          workflowDetails: data?.workflow,
          mainState: {
            edges: data?.edges || [],
            nodes: data?.nodes || [],
          },
          draftState: {
            edges: data?.edges || [],
            nodes: data?.nodes || [],
          },
        });
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (e) {
      console.log(e);
      update({
        error: "Something went wrong",
      });
    } finally {
      update({ loading: false });
    }
  };

  useEffect(() => {
    if (id) {
      onInit();
    }
  }, [id]);

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
    async (event: any) => {
      event.preventDefault();
      try {
        const type: TNodeTypes = event.dataTransfer.getData(
          "application/reactflow"
        );

        // check if the dropped element is valid
        if (typeof type === "undefined" || !type) {
          return;
        }
        let label = `${type.replaceAll("_", " ")}`;
        const triggerAlreadyExists = draftState.nodes.find(
          (node) =>
            ["WEBHOOK_NODE", "WEBHOOK_RESPONSE_NODE"].includes(type) &&
            node.type === type
        );

        if (triggerAlreadyExists) {
          toast.error(`Only one ${label} node is allowed`);
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
        const count = draftState.nodes.reduce(
          (a, b) => a + (b.type === type ? 1 : 0),
          0
        );

        if (count > 0) {
          label = `${label} ${count + 1}`;
        }
        const response = await fetch(`/api/workflows/${id}/addNode`, {
          method: "POST",
          body: JSON.stringify({
            label,
            description: "",
            type,
            positionX: position.x,
            positionY: position.y,
          }),
        });

        const json = await response.json();
        if (json?.error === false) {
          const node: AllNodesI = {
            id: json.node.id,
            type,
            position,
            data: {
              label,
              description: "",
            },
          };

          addNode(node);
        } else {
          throw new Error(json.message || "Failed to add node");
        }
      } catch (e) {
        console.log(e);
        toast.error("Failed to add node");
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

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      
      update({
        showSave:true,
        draftState: {
          ...draftState,
          edges: applyEdgeChanges(changes, draftState.edges),
        },
      });
    },
    [draftState]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      
      update({
        showSave:true,
        draftState: {
          ...draftState,
          edges: addEdge({ ...params, type: "default" }, draftState.edges),
        },
      });
    },
    [draftState]
  );

  return (
    <>
      <WorkflowDetailsHeader />
      <GlobalLayout className="!p-0">
        <div style={{ height: "100%", position: "relative" }}>
          <LoadingSpinner isLoading={loading} />
          {workflowDetails?.id && !error ? (
            <PlusSquare
              size={40}
              className="absolute rounded-lg cursor-pointer border shadow-md p-2 top-2 right-4 z-50"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            />
          ) : null}

          <ReactFlow
            onEdgesChange={onEdgesChange}
            onNodesChange={onNodesChange}
            onDrop={onDrop}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onInit={setReactFlowInstance}
            nodes={draftState.nodes}
            edgeTypes={{
              default: CustomEdge,
            }}
            edges={draftState.edges}
            nodeTypes={{
              WEBHOOK_NODE: CommonNode,
              WEBHOOK_RESPONSE_NODE: CommonNode,
              CODE_NODE: CommonNode,
            }}
          >
            <Background />
            <Controls  position="top-left"/>
          </ReactFlow>
        </div>
      </GlobalLayout>
    </>
  );
}

export default EditorPage;
