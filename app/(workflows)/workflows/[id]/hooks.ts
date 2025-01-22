import { useWorkflowStore } from "@/app/store";
import { AllNodesDataI, AllNodesI } from "@/lib/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export const useNodesEditor = () => {
  const [nodeData, setNodeData] = useState<AllNodesI | null>(null);

  const { selectedNode, draftState, update, deleteNode, workflowDetails } =
    useWorkflowStore();

  useEffect(() => {
    const findNode = draftState?.nodes?.find((d) => d?.id === selectedNode);
    if (findNode) {
      setNodeData(findNode);
    }
  }, [selectedNode, draftState]);

  const updateNodeParams = useCallback(
    async (payload: AllNodesDataI["parameters"]) => {
      try {
        const response = await fetch(
          `/api/workflows/${workflowDetails?.id}/updateNode`,
          {
            method: "PUT",
            body: JSON.stringify({
              nodeId: selectedNode,
              data: {
                parameters: payload,
                settings: draftState.nodesSettings[selectedNode]?.settings,
              },
            }),
          }
        );
        const data = await response.json();
        if (data?.error === false) {
          toast.success("Node parameters updated successfully");
          update({
            draftState: {
              ...draftState,
              nodesSettings: {
                ...draftState?.nodesSettings,
                [selectedNode]: {
                  ...draftState.nodesSettings[selectedNode],
                  parameters: {
                    ...draftState.nodesSettings[selectedNode]?.parameters,
                    ...payload,
                  },
                } as AllNodesDataI,
              },
            },
          });
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
          `/api/workflows/${workflowDetails?.id}/updateNode`,
          {
            method: "PUT",
            body: JSON.stringify({
              nodeId: selectedNode,
              data: {
                settings: payload,
                parameters: draftState.nodesSettings[selectedNode]?.parameters,
              },
            }),
          }
        );

        const data = await response.json();
        if (data?.error === false) {
          toast.success("Node settings updated successfully");
          update({
            draftState: {
              ...draftState,
              nodesSettings: {
                ...draftState?.nodesSettings,
                [selectedNode]: {
                  ...draftState.nodesSettings[selectedNode],
                  settings: {
                    ...draftState.nodesSettings[selectedNode]?.settings,
                    ...payload,
                  },
                } as AllNodesDataI,
              },
            },
          });
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

    // Recursive function to traverse parent nodes
    const traverse = (nodeId: string) => {
      // Prevent infinite loops by checking visited nodes
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      // Find all edges pointing to the current node
      const incomingEdges = draftState.edges.filter(
        (edge) => edge.target === nodeId
      );

      incomingEdges.forEach((edge) => {
        // Find the source node for the current edge
        const sourceNode = draftState.nodes.find(
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
  }, [draftState, selectedNode]);

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
  };
};
