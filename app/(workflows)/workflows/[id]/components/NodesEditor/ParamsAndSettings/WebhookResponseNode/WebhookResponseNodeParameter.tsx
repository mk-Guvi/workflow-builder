import { WebhookResponseNodeDataI } from "@/lib/types";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNodesEditor } from "../../hooks";
import { WebhookResponseNodeParamsSchema } from "../../../../utils";
import { X } from "lucide-react";
import CodeEditor from "@/components/editors/CodeEditor";

const respondTypeOptions = [
  {
    value: "TEXT",
    label: "Text",
  },
  {
    value: "JSON",
    label: "JSON",
  },
];

function WebhookResponseNodeParameter() {
  const { draftState, selectedNode } = useWorkflowStore();
  const { updateNodeParams } = useNodesEditor();
  const params = draftState?.nodesSettings[selectedNode]
    ?.parameters as WebhookResponseNodeDataI["parameters"];

  const form = useForm<z.infer<typeof WebhookResponseNodeParamsSchema>>({
    mode: "onChange",
    resolver: zodResolver(WebhookResponseNodeParamsSchema),
    defaultValues: {
      respondWith: params?.respondWith || "TEXT",
      responseCode: params?.responseCode,
      responseHeaders: params?.responseHeaders || [],
    },
  });

  const onSubmit = useCallback(
    (data: z.infer<typeof WebhookResponseNodeParamsSchema>) => {
      if (selectedNode) {
        updateNodeParams({
          respondWith: data.respondWith,
          responseCode: data.responseCode,
          responseHeaders: data.responseHeaders,
        });
      }
    },
    [selectedNode, updateNodeParams]
  );

  const onAddHeader = () => {
    const currentHeaders = form.getValues("responseHeaders");
    form.setValue("responseHeaders", [
      ...currentHeaders,
      { label: "", value: "" },
    ]);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col text-xs gap-2 h-full w-full"
      >
        <div className="flex flex-col gap-2 px-1 h-full w-full overflow-auto">
          <FormField
            control={form.control}
            name="respondWith"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Respond With</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue className="text-xs" placeholder="Select Respond With" />
                    </SelectTrigger>
                    <SelectContent>
                      {respondTypeOptions.map((type) => (
                        <SelectItem className="text-xs" key={type.value} value={type.value}>
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
              name="responseValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Response Value</FormLabel>
                  <FormControl>
                  <CodeEditor type={form.watch("respondWith")} nodes={["responseValue"]} value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          
            <FormField
              control={form.control}
              name="responseCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Response Code</FormLabel>
                <FormControl>
                  <Input 
                    
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="text-xs" 
                    placeholder="Enter Response Code" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel className="text-sm">Response Headers</FormLabel>
            {form.watch("responseHeaders").map((header, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <FormControl className="flex-1">
                  <Input
                    className="text-xs"
                    placeholder="Header Name"
                    value={header.label}
                    onChange={(e) => {
                      const currentHeaders = form.getValues("responseHeaders");
                      currentHeaders[index].label = e.target.value;
                      form.setValue("responseHeaders", currentHeaders);
                    }}
                  />
                </FormControl>
                <FormControl className="flex-1">
                  <Input
                    className="text-xs"
                    placeholder="Header Value"
                    value={header.value}
                    onChange={(e) => {
                      const currentHeaders = form.getValues("responseHeaders");
                      currentHeaders[index].value = e.target.value;
                      form.setValue("responseHeaders", currentHeaders);
                    }}
                  />
                </FormControl>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive"
                  onClick={() => {
                    const currentHeaders = form.getValues("responseHeaders");
                    currentHeaders.splice(index, 1);
                    form.setValue("responseHeaders", currentHeaders);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              onClick={onAddHeader} 
              size="sm" 

              className="mt-2 w-full"
            >
              Add Header
            </Button>
          </FormItem>
        </div>
        <Button type="submit" size="sm" className="mt-2">
          Save Parameters
        </Button>
      </form>
    </Form>
  );
}

export default WebhookResponseNodeParameter;
