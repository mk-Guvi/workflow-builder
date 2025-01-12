/* eslint-disable @typescript-eslint/no-explicit-any */
import { TNodeTypes } from "@/lib/types";

export const onDragStart = (
    event: any,
    nodeType: TNodeTypes
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };