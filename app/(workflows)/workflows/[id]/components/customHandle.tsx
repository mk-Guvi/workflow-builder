import React, { CSSProperties } from "react";
import { Handle, HandleProps } from "@xyflow/react";
import { useWorkflowStore } from "@/store";


type Props = HandleProps & { style?: CSSProperties };

const CustomHandle = (props: Props) => {
  const { draftState } = useWorkflowStore();
  return (
    <Handle
      {...props}
      isValidConnection={(e) => {
        const sourcesFromHandleInState = draftState.edges.filter(
          (edge) => edge.source === e.source
        ).length;
        const sourceNode = draftState.nodes.find(
          (node) => node.id === e.source
        );
        //target
        const targetFromHandleInState = draftState.edges.filter(
          (edge) => edge.target === e.target
        ).length;

        if (targetFromHandleInState === 1) return false;
        if (sourceNode?.type === "Condition") return true;
        if (sourcesFromHandleInState < 1) return true;
        return false;
      }}
      className="!-bottom-2 !h-4 !w-4 dark:bg-neutral-800"
    />
  );
};

export default CustomHandle;
