import React from "react";
import NodeDataView from "./NodeDataView";
import { NodeSelector } from "./NodeSelector";

function NodeInputDataView() {
  return (
    <div className="h-full p-3 w-full flex flex-col">
      <NodeSelector />
      <div className="flex-1 w-full overflow-auto">
        <NodeDataView data={""} />
      </div>
    </div>
  );
}

export default NodeInputDataView;
