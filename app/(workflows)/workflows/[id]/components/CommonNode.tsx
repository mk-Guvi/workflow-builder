import React, { useMemo } from "react";
import {
  Position,
  //  useNodeId
} from "@xyflow/react";
import NodeIconByType from "./IconsByNodeType";
import CustomHandle from "./customHandle";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import clsx from "clsx";
import { AllNodesI } from "@/lib/types";
//import { useWorkflowStore } from "@/app/store";

type CommonNodeProps = Pick<AllNodesI, 'type' | 'data'|"dragging"|"selected">;

const CommonNode = ({ type, data,selected ,dragging}: CommonNodeProps) => {
  // const {  draftState } = useWorkflowStore();
  // const nodeId = useNodeId(); //reactflow gives the currentNodeId that is rendered

  const logo = useMemo(() => {
    return <NodeIconByType type={type} />;
  }, [type]);

  return (
    <>
      {type !== "WEBHOOK_NODE" && (
        <CustomHandle
          type="target"
          position={Position.Top}
          style={{ zIndex: 100 }}
        />
      )}
      <Card
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
        className="relative max-w-[400px] dark:border-muted-foreground/70"
      >
        <CardHeader className="flex flex-row items-center gap-4">
          <div>{logo}</div>
          <div>
            <CardTitle className="text-md">{data.label}</CardTitle>
            {data?.description ? (
              <CardDescription>
                <p>{data.description}</p>
              </CardDescription>
            ) : null}
          </div>
        </CardHeader>

        <Badge variant="secondary" className="absolute right-2 top-2">
          {type}
        </Badge>
        <div
          className={clsx("absolute left-3 top-4 h-2 w-2 rounded-full", {
            "bg-green-500": selected,
            "bg-orange-500": dragging,
            
          })}
        ></div>
      </Card>
      <CustomHandle type="source" position={Position.Bottom} id="a" />
    </>
  );
};

export default CommonNode;