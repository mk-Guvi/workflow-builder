import { Workflow, WorkflowFormSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Card, CardContent } from "@/components/ui/card";

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
import { useModal } from "@/app/providers/modalProvider";


type Props = {
  workflow?: Workflow;
};

const Workflowform = ({ workflow }: Props) => {
  const {setClose}=useModal()


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
        setClose();
      }else{
        toast.error("Something Went Wrong")
      }
      
    } else {
      const response = await onCreateWorkflow(values.name, values.description);
      if (response) {
        toast.message(response.message);
        router.refresh();
        setClose();
      }else{
        toast.error("Something Went Wrong")
      }
      
    }
  };

  return (
    <Card className="w-full  h-fit  border ">
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

            <footer className="flex items-center gap-2 w-full flex-wrap">
              <Button
                variant={"outline"}
                className="flex-1"
                onClick={setClose}
                type="button"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button className="flex-1" disabled={isLoading} type="submit">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </footer>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Workflowform;
