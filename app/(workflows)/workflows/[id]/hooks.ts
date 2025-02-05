import { useWorkflowStore } from "@/app/store";
import { AllNodesDataI, AllNodesI } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo,  } from "react";
import { toast } from "sonner";

export const useNodesEditor = () => {
  
  const searchParams = useSearchParams();
  const executionId = searchParams.get("e_id");
  
  const {
    selectedNode,
    draftState,
    nodesData,
    executionState,
    updateNodeData,
    update,
    deleteNode,
    workflowDetails,
  } = useWorkflowStore();

  const nodeData = useMemo(() => {
    if (!selectedNode) return;
    const findNode = executionId
      ? executionState?.executionsDetails?.nodes?.find(
          (d) => d?.id === selectedNode
        )
      : draftState?.nodes?.find((d) => d?.id === selectedNode);
   
    return findNode
  }, [selectedNode, draftState, executionId, executionState]);

  const updateNodeParams = useCallback(
    async (payload: AllNodesDataI["parameters"]) => {
      try {
        const response = await fetch(
          `/api/workflows/${workflowDetails?.id}/updateNodeData`,
          {
            method: "PUT",
            body: JSON.stringify({
              nodeId: selectedNode,
              data: {
                parameters: payload,
                settings: nodesData?.[selectedNode]?.settings,
              },
            }),
          }
        );
        const data = await response.json();
        if (data?.error === false) {
          toast.success("Node parameters updated successfully");
          updateNodeData(selectedNode, {
            ...nodesData?.[selectedNode],
            parameters: {
              ...nodesData?.[selectedNode]?.parameters,
              ...payload,
            },
          } as AllNodesDataI);

          return true;
        } else {
          if (data?.message) {
            toast.error(data?.message);
            return false;
          } else {
            throw new Error("Failed to update node");
          }
        }
      } catch (e) {
        console.log(e);
        toast.error("Something went wrong");
        return false;
      }
    },
    [selectedNode, draftState, update]
  );

  const updateNodeSettings = useCallback(
    async (payload: Partial<AllNodesDataI["settings"]>) => {
      try {
        const response = await fetch(
          `/api/workflows/${workflowDetails?.id}/updateNodeData`,
          {
            method: "PUT",
            body: JSON.stringify({
              nodeId: selectedNode,
              data: {
                settings: payload,
                parameters: nodesData?.[selectedNode]?.parameters,
              },
            }),
          }
        );

        const data = await response.json();
        if (data?.error === false) {
          toast.success("Node settings updated successfully");
          updateNodeData(selectedNode, {
            ...nodesData?.[selectedNode],
            settings: {
              ...nodesData?.[selectedNode]?.settings,
              ...payload,
            },
          } as AllNodesDataI);

          return true;
        } else {
          if (data?.message) {
            toast.error(data?.message);
            return false;
          } else {
            throw new Error("Failed to update node settings");
          }
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    [selectedNode, draftState, update]
  );

  const getPrevNodes = useMemo((): AllNodesI[] => {
    const visited = new Set<string>();
    const result: AllNodesI[] = [];
    const currentNodes= executionId
      ? executionState?.executionsDetails?.nodes
      : draftState.nodes;
    const currentEdges= executionId
      ? executionState?.executionsDetails?.edges
      : draftState.edges;
    

    // Recursive function to traverse parent nodes
    const traverse = (nodeId: string) => {
      // Prevent infinite loops by checking visited nodes
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      // Find all edges pointing to the current node
      const incomingEdges = currentEdges.filter(
        (edge) => edge.target === nodeId
      );

      incomingEdges.forEach((edge) => {
        // Find the source node for the current edge
        const sourceNode = currentNodes.find(
          (node) => node.id === edge.source
        );
        if (sourceNode) {
          result.push(sourceNode); // Add the source node to the result
          traverse(sourceNode.id); // Recursively traverse its parents
        }
      });
    };

    // Start traversal from the selected node
    traverse(selectedNode);

    return result;
  }, [draftState, selectedNode,executionId]);

  const onDeleteNode = useCallback(
    async (nodeId: string) => {
      try {
        const response = await fetch(
          `/api/workflows/${workflowDetails?.id}/deleteNode`,
          {
            method: "DELETE",
            body: JSON.stringify({ nodeId }),
          }
        );
        const data = await response.json();
        if (data?.error === false) {
          deleteNode(nodeId);
        } else {
          if (data?.message) {
            toast.error(data?.message);
          } else {
            throw new Error("Failed to delete node");
          }
        }
      } catch (e) {
        console.log(e);
        toast.error("Failed to delete node");
      }
    },
    [draftState]
  );

  return {
    getPrevNodes,
    nodeData,
    updateNodeParams,
    updateNodeSettings,
    onDeleteNode,
    executionId,
  };
};
