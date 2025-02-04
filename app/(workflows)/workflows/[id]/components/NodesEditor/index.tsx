import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { useCallback, useMemo, useState } from "react";
import NodeDataView from "./NodeDataView";
import { X, GripVertical } from "lucide-react";
import { useDrawer } from "@/app/providers/drawerProvider";

import Header from "./Header";
import NodeNameEditor from "./NodeNameEditor";
import NodeSections from "./NodeSections";
import NodeInputDataView from "./NodeInputDataView";
import { useNodesEditor } from "../../hooks";
import { useWorkflowStore } from "@/app/store";

const CustomHandle = ({ disabled }: { disabled: boolean }) =>
  disabled ? null : (
    <ResizableHandle disabled={disabled}>
      <div className="h-full w-full flex items-center justify-center">
        <GripVertical
          className={`h-4 w-4 ${
            disabled ? "opacity-0" : "opacity-50 hover:opacity-100"
          }`}
        />
      </div>
    </ResizableHandle>
  );

function NodesEditor() {
  const { setClose } = useDrawer();
  const [fullScreenView, setFullScreenView] = useState("");
  const { nodeData } = useNodesEditor();
  const { nodesData } = useWorkflowStore();
  console.log(nodeData, "nodeda");
  const selectedFullView = useMemo(() => {
    return {
      OUTPUT: fullScreenView === "OUTPUT",
      NODE: fullScreenView === "NODE",
      INPUT: fullScreenView === "INPUT",
    };
  }, [fullScreenView]);

  const onChangeScreen = useCallback((value: "OUTPUT" | "NODE" | "INPUT") => {
    setFullScreenView((prev) => (prev === value ? "" : value));
  }, []);

  const getOutputData=useMemo(()=>{
   return nodeData?.id ? nodesData?.[nodeData?.id]?.outputData?.map(d=>d.outputJson) : ""
  },[nodesData,nodeData?.id])

  return (
    <main className="flex h-full w-full flex-col gap-4 pt-3 overflow-y-auto">
      <header className="flex items-center gap-2 px-2  flex-wrap">
        <div className="flex-1">
          <NodeNameEditor />
        </div>
        <X onClick={setClose} />
      </header>
      <div className="flex-1 w-full border rounded-md overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={100}
            minSize={25}
            className={`flex flex-col h-full w-full ${
              fullScreenView && fullScreenView !== "INPUT" ? "hidden" : ""
            }`}
          >
            <Header
              onChangeFullScreen={() => onChangeScreen("INPUT")}
              title="Input"
              isFullScreen={selectedFullView.INPUT}
            ></Header>
            <NodeInputDataView />
          </ResizablePanel>
          <CustomHandle disabled={!!fullScreenView} />
          <ResizablePanel
            defaultSize={100}
            minSize={25}
            className={`flex flex-col h-full w-full ${
              fullScreenView && fullScreenView !== "NODE" ? "hidden" : ""
            }`}
          >
            <Header
              // onChangeFullScreen={() => onChangeScreen("NODE")}
              title="Node"
              // isFullScreen={selectedFullView.NODE}
            ></Header>
            <NodeSections />
          </ResizablePanel>
          <CustomHandle disabled={!!fullScreenView} />
          <ResizablePanel
            defaultSize={100}
            minSize={25}
            className={`flex flex-col h-full w-full ${
              fullScreenView && fullScreenView !== "OUTPUT" ? "hidden" : ""
            }`}
          >
            <Header
              onChangeFullScreen={() => onChangeScreen("OUTPUT")}
              title="Output"
              isFullScreen={selectedFullView.OUTPUT}
            ></Header>
            <NodeDataView
              data={getOutputData}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
}

export default NodesEditor;
