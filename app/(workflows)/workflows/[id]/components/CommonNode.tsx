import React, { useMemo } from "react";
import {
  Position,
  useNodeId,
  //  useNodeId
} from "@xyflow/react";
import NodeIconByType from "./IconsByNodeType";
import CustomHandle from "./customHandle";
import clsx from "clsx";
import { AllNodesI } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2Icon } from "lucide-react";
import { useWorkflowStore } from "@/app/store";
import { useDrawer } from "@/app/providers/drawerProvider";
import GlobalDrawer from "@/components/globals/GlobalDrawer";
import NodesEditor from "./NodesEditor";
//import { useWorkflowStore } from "@/app/store";

type CommonNodeProps = Pick<
  AllNodesI,
  "type" | "data" | "dragging" | "selected"
>;

const CommonNode = ({ type, data, selected, dragging }: CommonNodeProps) => {
  const { deleteNode, update } = useWorkflowStore();
  const { setOpen, setFullScreen } = useDrawer();
  const nodeId = useNodeId();

  const logo = useMemo(() => {
    return <NodeIconByType type={type} size={10} />;
  }, [type]);

  const onOpen = () => {
    update({
      selectedNode: `${nodeId}`,
    });
    setFullScreen(true);
    setOpen(
      <GlobalDrawer
        title="Workflow Nodes"
        hideHeader={true}
        subheading="Nodes are the Building blocks for the workflow."
        modal={false}
      >
        <NodesEditor />
      </GlobalDrawer>
    );
  };
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger>
          <TooltipContent
            side="top"
            className="bg-transparent text-gray-500 p-1  backdrop-blur-xl"
          >
            <Trash2Icon
              size={16}
              className="cursor-pointer hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                deleteNode(`${nodeId}`);
              }}
            />
          </TooltipContent>
          {type !== "WEBHOOK_NODE" && (
            <CustomHandle type="target" position={Position.Left} />
          )}

          <div
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
              // const val = draftState.nodes.find((n) => n.id === nodeId);
              // if (val)
              // dispatch({
              //   type: "SELECTED_ELEMENT",
              //   payload: {
              //     element: val,
              //   },
              // });
            }}
            className="w-fit p-2"
          >
            <div className="flex flex-row items-center gap-1">
              <div>{logo}</div>
              <div>
                <p className="!text-[0.5rem] font-medium">{data.label}</p>
              </div>
            </div>

            <div
              className={clsx("absolute left-1 top-1 h-1 w-1 rounded-full", {
                "bg-green-500": selected,
                "bg-orange-500": dragging,
              })}
            ></div>
          </div>

          <CustomHandle type="source" position={Position.Right} />
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CommonNode;
