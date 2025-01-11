import { Workflow, WorkflowFormSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Card, CardContent, } from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  onCreateWorkflow,
  onUpdateWorkflow,
} from "../_actions/workflowsActions";
import { useDrawer } from "@/app/providers/drawerProvider";

type Props = {
  workflow?: Workflow;
};

const Workflowform = ({ workflow }: Props) => {
  const { setClose } = useDrawer();
  const form = useForm<z.infer<typeof WorkflowFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(WorkflowFormSchema),
    defaultValues: {
      name: workflow?.name || "",
      description: workflow?.description || "",
    },
  });

  const isLoading = form.formState.isLoading;
  const router = useRouter();

  const handleSubmit = async (values: z.infer<typeof WorkflowFormSchema>) => {
    if (workflow?.id) {
      const response = await onUpdateWorkflow({
        ...workflow,
        name: values.name,
        description: values.description,
      });
      if (response) {
        toast.message(response.message);
        router.refresh();
      }
      setClose();
    } else {
      const response = await onCreateWorkflow(values.name, values.description);
      if (response) {
        toast.message(response.message);
        router.refresh();
      }
      setClose();
    }
  };

  return (
    <Card className="w-full max-w-[650px] py-6 border mt-2">
     
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4 text-left"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-4" disabled={isLoading} type="submit">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Workflowform;
