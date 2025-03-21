import { WebhookNodeDataI } from "@/lib/types";
import React, { useCallback } from "react";

import { useWorkflowStore } from "@/app/store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { WebhookNodeSettingsSchema } from "@/app/(workflows)/workflows/[id]/utils";

import { Button } from "@/components/ui/button";
import { useNodesEditor } from "../../../../hooks";
import { Textarea } from "@/components/ui/textarea";
import { useDrawer } from "@/app/providers/drawerProvider";

function WebhookNodeSettings() {
  const { nodesData, selectedNode } = useWorkflowStore();
  const { updateNodeSettings,executionId } = useNodesEditor();
  const { setIsDisabled, isDisabled } = useDrawer();
  const settings = nodesData?.[selectedNode]
    ?.settings as WebhookNodeDataI["settings"];

  const form = useForm<z.infer<typeof WebhookNodeSettingsSchema>>({
    mode: "onChange",
    resolver: zodResolver(WebhookNodeSettingsSchema),
    defaultValues: {
      notes: settings?.notes || "",
    },
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof WebhookNodeSettingsSchema>) => {
      if (selectedNode) {
        setIsDisabled(true);
        await updateNodeSettings({
          ...data,
        });
        setIsDisabled(false);
      }
    },
    [selectedNode, updateNodeSettings]
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
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Notes</FormLabel>
                <FormControl>
                  <Textarea
                    className="text-xs h-[15rem]"
                    placeholder="Enter Notes"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {executionId ? null : (
          <Button
            type="submit"
            disabled={isDisabled}
            size={"sm"}
            className="mt-2"
          >
            Save Settings
        </Button>
        )}
      </form>
    </Form>
  );
}

export default WebhookNodeSettings;
