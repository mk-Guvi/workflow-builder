"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNodesEditor } from "../../hooks";
import { useWorkflowStore } from "@/app/store";
import { getNodeData } from "../../utils";

export function NodeSelector() {
  const [open, setOpen] = React.useState(false);

  const { getPrevNodes, executionId } = useNodesEditor();
  const {
    nodeInputView,
    nodesData,
    update,
    executionState,
    workflowDetails,
    updateNodeData,
  } = useWorkflowStore();

  const updatedValue = React.useMemo(() => {
    const findNode = getPrevNodes.find((each) => each.id === nodeInputView);
    return findNode?.data?.label || "Select node";
  }, [nodeInputView, getPrevNodes]);

  React.useEffect(() => {
    if (getPrevNodes?.length > 0) {
      update({
        nodeInputView: getPrevNodes[0].id,
      });
    } else {
      update({
        nodeInputView: "",
      });
    }
  }, [getPrevNodes]);

  React.useEffect(() => {
    if (!nodesData?.[nodeInputView]?.parameters && nodeInputView) {
      callNodeData();
    }
  }, [nodeInputView, nodesData]);

  const callNodeData = async () => {
    const findNodeDetails = executionState?.executionsDetails?.nodes?.find(
      (d) => d?.id === nodeInputView
    );

    if (!findNodeDetails) {
      return;
    }
    const result = await getNodeData({
      workflowId: workflowDetails?.id || "",
      executionId: executionId || "",
      nodeId: findNodeDetails?.workflowNodeId || "",
    });
    if (result?.error === false) {
      updateNodeData(`${nodeInputView}`, result?.data);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] text-xs text-left"
        >
          <p title={updatedValue} className="text-xs truncate flex-1">
            {updatedValue}
          </p>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search node" className="text-xs" />
          <CommandList>
            <CommandEmpty>No Node found.</CommandEmpty>
            <CommandGroup>
              {getPrevNodes.map((each) => (
                <CommandItem
                  className="text-xs "
                  key={each.id}
                  value={each.id}
                  onSelect={() => {
                    update({
                      nodeInputView: each.id,
                    });
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      nodeInputView === each.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {each.data.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
