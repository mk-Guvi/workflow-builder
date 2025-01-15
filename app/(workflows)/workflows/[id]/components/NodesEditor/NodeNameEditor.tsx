import { useWorkflowStore } from "@/app/store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { NodeNameSchema } from "@/lib/types";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2, Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function NodeNameEditor() {
  const { selectedNode, draftState, update } = useWorkflowStore();
  const form = useForm<z.infer<typeof NodeNameSchema>>({
    mode: "onChange",
    resolver: zodResolver(NodeNameSchema),
    defaultValues: {
      name: "",
    },
  });
  const [initialName, setInitialName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canEditName, setCanEditName] = useState(false);

  useEffect(() => {
    const findNode = draftState?.nodes?.find((d) => d?.id === selectedNode);
    if (findNode) {
      form.setValue("name", (findNode?.data?.label || "")?.trim());
      setInitialName((findNode?.data?.label || "")?.trim());
    }
  }, [selectedNode, draftState]);

  const handleSubmit = async (values: z.infer<typeof NodeNameSchema>) => {
    setIsLoading(true);
    // await onUpdate(values.name);
    setCanEditName(false);
    const findNode = draftState?.nodes?.find((d) => d?.id === selectedNode);
    if (findNode) {
      findNode.data.label = values.name;
      update({
        draftState: {
          ...draftState,
          nodes: draftState.nodes.map((node) => {
            if (node.id === findNode.id) {
              return findNode;
            }
            return node;
          }),
        },
      });
    }

    setIsLoading(false);
    
  };

  return (
    <Popover open={canEditName}>
      <PopoverContent sideOffset={14} side="right" className="bg-white mt-4">
        <Form {...form}>
          <form
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Rename node</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-2">
            <Button
            size={"sm"}
              disabled={isLoading}
              type="button"
              variant={"outline"}
              onClick={() => {
                form.setValue("name", initialName);
                setCanEditName(false);
              }}
            >
              Cancel
            </Button>
            <Button size={"sm"} disabled={isLoading} type="submit">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Renaming
                </>
              ) : (
                "Rename"
              )}
            </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>

      <div className="flex group items-center gap-2">
        <p title={initialName} className="max-w-[20rem] truncate">
          {initialName}
        </p>

        <PopoverTrigger asChild>
          <Pencil
            onClick={() => setCanEditName(true)}
            size={14}
            className="cursor-pointer group-hover:visible invisible"
          />
        </PopoverTrigger>
      </div>
    </Popover>
  );
}

export default NodeNameEditor;
