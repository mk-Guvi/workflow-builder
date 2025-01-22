import { WebhookNodeDataI } from "@/lib/types";
import React, { useCallback, useEffect } from "react";

import { useWorkflowStore } from "@/app/store";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { WebhookNodeParamsSchema } from "@/app/(workflows)/workflows/[id]/utils";
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
import { useNodesEditor } from "../../../../hooks";
import { useDrawer } from "@/app/providers/drawerProvider";

const methodOptions = ["GET", "POST"];
const respondTypeOptions = [
  {
    value: "IMMEDIATELY",
    label: "Immediately",
  },
  {
    value: "LAST_NODE",
    label: "Last Node",
  },
  {
    value: "RESPONSE_WEBHOOK",
    label: "Response Webhook",
  },
];

function WebhookNodeParameter() {
  const { draftState, selectedNode } = useWorkflowStore();
  const { updateNodeParams } = useNodesEditor();
  const { setIsDisabled ,isDisabled} = useDrawer();
  const params = draftState?.nodesSettings[selectedNode]
    ?.parameters as WebhookNodeDataI["parameters"];

  const form = useForm<z.infer<typeof WebhookNodeParamsSchema>>({
    mode: "all",
    resolver: zodResolver(WebhookNodeParamsSchema),
    defaultValues: {
      path: params?.path || "",
      method: params?.method || "GET",
      respondType: params?.respondType || "IMMEDIATELY",
    },
  });

  useEffect(() => {
    form.reset({
      ...params,
    });
  }, [params]);

  const onSubmit = useCallback(
    async (data: z.infer<typeof WebhookNodeParamsSchema>) => {
      if (selectedNode) {
        setIsDisabled(true);
        await updateNodeParams({
         ...data,
        });
        setIsDisabled(false);
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
            name="path"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Path</FormLabel>
                <FormControl>
                  <Input
                    className="text-xs"
                    placeholder="Enter Path"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Method</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue
                        className="text-xs"
                        placeholder="Select Method"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {methodOptions.map((method) => (
                        <SelectItem
                          className="text-xs"
                          key={method}
                          value={method}
                        >
                          {method}
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
            name="respondType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Respond Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue
                        className="text-xs"
                        placeholder="Select Respond Type"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {respondTypeOptions.map((type) => (
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
        </div>
        <Button type="submit" disabled={isDisabled} size={"sm"} className="mt-2">
          Save Settings
        </Button>
      </form>
    </Form>
  );
}

export default WebhookNodeParameter;
