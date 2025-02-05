import React from "react";
import NodeDataView from "./NodeDataView";
import { NodeSelector } from "./NodeSelector";
import { useWorkflowStore } from "@/app/store";

function NodeInputDataView() {
  const { nodesData, nodeInputView } = useWorkflowStore();

  return (
    <div className="h-full p-3 w-full flex flex-col">
      <NodeSelector />
      <div className="flex-1 w-full overflow-auto">
        <NodeDataView
          data={
            nodesData?.[nodeInputView]?.outputData?.map((d) => d.outputJson) ||
            ""
          }
        />
      </div>
    </div>
  );
}

export default NodeInputDataView;
