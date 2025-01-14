import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import NodeDataView from "./NodeDataView";
import { X, GripVertical } from "lucide-react";
import { useDrawer } from "@/app/providers/drawerProvider";
import { useWorkflowStore } from "@/app/store";
import { Input } from "@/components/ui/input";
import Header from "./Header";

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
  const { selectedNode, draftState } = useWorkflowStore();
  const [nodeName, setNodeName] = useState("");
  const [fullScreenView, setFullScreenView] = useState("");

  useEffect(() => {
    const findNode = draftState?.nodes?.find((d) => d?.id === selectedNode);
    if (findNode) {
      setNodeName(findNode?.data?.label || "");
    }
  }, [selectedNode, draftState]);

  const seletedFullView = useMemo(() => {
    return {
      OUTPUT: fullScreenView === "OUTPUT",
      NODE: fullScreenView === "NODE",
      INPUT: fullScreenView === "INPUT",
    };
  }, [fullScreenView]);

  const onChangeScreen = useCallback((value: "OUTPUT" | "NODE" | "INPUT") => {
    setFullScreenView((prev) => (prev === value ? "" : value));
  }, []);

  return (
    <main className="flex h-full w-full flex-col gap-4 pt-3 overflow-y-auto">
      <header className="flex items-center gap-2 px-2  flex-wrap">
        <p className="flex-1">
          <Input
            value={nodeName}
            onChange={(e) => {
              setNodeName(e.target.value);
            }}
            className="max-w-[15rem]"
          />
        </p>
        <X onClick={setClose} />
      </header>
      <div className="flex-1 w-full border rounded-md overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={100}
            minSize={25}
            className={
              fullScreenView && fullScreenView !== "INPUT" ? "hidden" : ""
            }
          >
            <Header
              onChangeFullScreen={() => onChangeScreen("INPUT")}
              title="Input"
              isFullScreen={seletedFullView.INPUT}
            >
              <div></div>
            </Header>
            <NodeDataView data={""} />
          </ResizablePanel>
          <CustomHandle disabled={!!fullScreenView} />
          <ResizablePanel
            defaultSize={100}
            minSize={25}
            className={
              fullScreenView && fullScreenView !== "NODE" ? "hidden" : ""
            }
          >
            <Header
              onChangeFullScreen={() => onChangeScreen("NODE")}
              title="Node"
              isFullScreen={seletedFullView.NODE}
            >
              <div></div>
            </Header>
            <NodeDataView data={""} />
          </ResizablePanel>
          <CustomHandle disabled={!!fullScreenView} />
          <ResizablePanel
            defaultSize={100}
            minSize={25}
            className={
              fullScreenView && fullScreenView !== "OUTPUT" ? "hidden" : ""
            }
          >
            <Header
              onChangeFullScreen={() => onChangeScreen("OUTPUT")}
              title="Output"
              isFullScreen={seletedFullView.OUTPUT}
            >
              <div></div>
            </Header>
            <NodeDataView data={""} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
}

export default NodesEditor;
