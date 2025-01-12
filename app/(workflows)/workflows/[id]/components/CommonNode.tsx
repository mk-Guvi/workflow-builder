import { CommonNodeI } from "@/lib/types";
import React, { useMemo } from "react";
import { Position, 
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
//import { useWorkflowStore } from "@/app/store";

const EditorCanvasCardSingle = ({ data }: { data: CommonNodeI }) => {
  // const {  draftState } = useWorkflowStore();
  // const nodeId = useNodeId(); //reactflow gives the currentNodeId that is rendered

  const logo = useMemo(() => {
    return <NodeIconByType type={data.nodeType} />;
  }, [data]);

  return (
    <>
      {data.type !== "Trigger" && data.type !== "Google Drive" && (
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
          {data.nodeType}
        </Badge>
        <div
          className={clsx("absolute left-3 top-4 h-2 w-2 rounded-full", {
            "bg-green-500": Math.random() < 0.6,
            "bg-orange-500": Math.random() >= 0.6 && Math.random() < 0.8,
            "bg-red-500": Math.random() >= 0.8,
          })}
        ></div>
      </Card>
      <CustomHandle type="source" position={Position.Bottom} id="a" />
    </>
  );
};

export default EditorCanvasCardSingle;
