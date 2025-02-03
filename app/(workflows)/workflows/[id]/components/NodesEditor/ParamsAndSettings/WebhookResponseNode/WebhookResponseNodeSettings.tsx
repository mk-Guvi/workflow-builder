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

import { Button } from "@/components/ui/button";
import { useNodesEditor } from "../../../../hooks";
import { WebhookResponseNodeSettingsSchema } from "../../../../utils";
import { Textarea } from "@/components/ui/textarea";
import { useDrawer } from "@/app/providers/drawerProvider";

function WebhookResponseNodeSettings() {
  const { nodesData, selectedNode } = useWorkflowStore();
  const { updateNodeSettings, executionId } = useNodesEditor();
  const settings = nodesData?.[selectedNode]
    ?.settings as WebhookResponseNodeDataI["settings"];
  const { isDisabled, setIsDisabled } = useDrawer();
  const form = useForm<z.infer<typeof WebhookResponseNodeSettingsSchema>>({
    mode: "onChange",
    resolver: zodResolver(WebhookResponseNodeSettingsSchema),
    defaultValues: {
      notes: settings?.notes || "",
      onError: settings?.onError || "STOP",
      retryOnFail: {
        isEnabled: settings?.retryOnFail?.isEnabled || false,
        maxTries: settings?.retryOnFail?.maxTries || 1,
        waitBetweenTries: settings?.retryOnFail?.waitBetweenTries || 1000,
      },
    },
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof WebhookResponseNodeSettingsSchema>) => {
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
        className="flex flex-col focus:!outline-none focus:!ring-0 text-xs gap-2 h-full w-full"
      >
        <div className="flex flex-col gap-2 px-1 h-full w-full overflow-auto">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} className="w-full h-[15rem]" />
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
            size="sm"
            className="mt-2"
          >
            Save Settings
          </Button>
        )}
      </form>
    </Form>
  );
}

export default WebhookResponseNodeSettings;
