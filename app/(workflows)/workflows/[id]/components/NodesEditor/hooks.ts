import { useWorkflowStore } from "@/app/store";
import { AllNodesDataI, AllNodesI } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export const useNodesEditor = () => {
  const [nodeData, setNodeData] = useState<AllNodesI | null>(null);

  const { selectedNode, draftState, update } = useWorkflowStore();

  useEffect(() => {
    const findNode = draftState?.nodes?.find((d) => d?.id === selectedNode);
    if (findNode) {
      setNodeData(findNode);
    }
  }, [selectedNode, draftState]);

  const updateNodeParams = useCallback(
    (payload: Partial<AllNodesDataI["parameters"]>) => {
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
    },
    [selectedNode, draftState, update]
  );

  const updateNodeSettings = useCallback(
    (payload: Partial<AllNodesDataI["settings"]>) => {
      update({
        draftState: {
          ...draftState,
          nodesSettings: {
            ...draftState.nodesSettings,
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
    },
    [selectedNode, draftState, update]
  );

  return {
    nodeData,
    updateNodeParams,
    updateNodeSettings,
  };
};
