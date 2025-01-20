import { CodeNodeDataI } from "@/lib/types";
import React, { useCallback } from "react";

import { useWorkflowStore } from "@/app/store";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNodesEditor } from "../../../../hooks";
import { CodeNodeParamsSchema } from "../../../../utils";
import CodeEditor from "@/components/editors/CodeEditor";

const typeOptions = [
  {
    label: "Javascript",
    value: "JS",
  },
];

function CodeNodeParameter() {
  const { draftState, selectedNode } = useWorkflowStore();
  const { updateNodeParams } = useNodesEditor();
  const params = draftState?.nodesSettings[selectedNode]
    ?.parameters as CodeNodeDataI["parameters"];

  const form = useForm<z.infer<typeof CodeNodeParamsSchema>>({
    mode: "onChange",
    resolver: zodResolver(CodeNodeParamsSchema),
    defaultValues: {
      type: params?.type || "JS",
      code: params?.code || "",
    },
  });

  const onSubmit = useCallback(
    (data: z.infer<typeof CodeNodeParamsSchema>) => {
      if (selectedNode) {
        updateNodeParams({
          type: data.type,
          code: data.code,
        });
      }
    },
    [selectedNode, updateNodeParams]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col text-xs gap-2 h-full w-full"
      >
        <div className="flex flex-col gap-2 px-1 h-full w-full overflow-auto">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue
                        className="text-xs"
                        placeholder="Select Respond With"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((type) => (
                        <SelectItem
                          className="text-xs"
                          key={type.value}
                          value={type.value}
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Response Value</FormLabel>
                <FormControl>
                  <CodeEditor
                    type={form.watch("type")}
                    nodes={["responseValue"]}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" size="sm" className="mt-2">
          Save Parameters
        </Button>
      </form>
    </Form>
  );
}

export default CodeNodeParameter;
