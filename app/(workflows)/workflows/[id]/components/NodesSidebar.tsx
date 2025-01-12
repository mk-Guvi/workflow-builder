import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { nodesList } from "@/lib/constants";
import React from "react";
import { onDragStart } from "../utils";
import NodeIconByType from "./IconsByNodeType";
import { useDrawer } from "@/app/providers/drawerProvider";
import { Button } from "@/components/ui/button";

function NodesSidebar() {

  const {setClose}=useDrawer()
  return (
    <div className="h-full  w-full flex flex-col gap-3 overflow-auto">
      <div className="flex-1 flex flex-col gap-4 overflow-auto">
      {nodesList.map((each) => {
        return (
          <Card
            key={each.value}
            draggable
            className="w-full cursor-grab border-black rounded-lg bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900"
            onDragStart={(event) => onDragStart(event, each.value)}
          >
            <CardHeader className="flex flex-row items-center gap-4 p-4">
              <NodeIconByType type={each.value} />
              <CardTitle className="text-md">
                {each.label}
                <CardDescription>{each.description}</CardDescription>
              </CardTitle>
            </CardHeader>
          </Card>
        );
      })}
    
      </div>
      <footer className="flex items-center border-t p-3 justify-end"><Button onClick={setClose}>Close</Button></footer>
    </div>
  );
}

export default NodesSidebar;
