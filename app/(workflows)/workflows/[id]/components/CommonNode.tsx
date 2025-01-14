import React, { useMemo } from "react";
import {
  Position,
  //  useNodeId
} from "@xyflow/react";
import NodeIconByType from "./IconsByNodeType";
import CustomHandle from "./customHandle";
import clsx from "clsx";
import { AllNodesI } from "@/lib/types";
//import { useWorkflowStore } from "@/app/store";

type CommonNodeProps = Pick<
  AllNodesI,
  "type" | "data" | "dragging" | "selected"
>;

const CommonNode = ({ type, data, selected, dragging }: CommonNodeProps) => {
  // const {  draftState } = useWorkflowStore();
  // const nodeId = useNodeId(); //reactflow gives the currentNodeId that is rendered

  const logo = useMemo(() => {
    return <NodeIconByType type={type} />;
  }, [type]);

  return (
    <>
      {type !== "WEBHOOK_NODE" && (
        <CustomHandle type="target" position={Position.Left} />
      )}
      <div
        onClick={(e) => {
          e.stopPropagation();
          // const val = draftState.nodes.find((n) => n.id === nodeId);
          // if (val)
          // dispatch({
          //   type: "SELECTED_ELEMENT",
          //   payload: {
          //     element: val,
          //   },
          // });
        }}
        className="w-fit"
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
    </>
  );
};

export default CommonNode;
