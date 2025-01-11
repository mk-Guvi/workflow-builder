"use client"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Workflow } from "@/lib/types";
import {  EditIcon, Trash2 } from "lucide-react";
import { useModal } from "@/app/providers/modalProvider";
import GlobalModal from "@/components/globals/GlobalModal";
import Workflowform from "./workflowForm";

type WorkflowCardProps = {
  workflow: Workflow;
};

export default function WorkflowCard({ workflow }: WorkflowCardProps) {
  const { setOpen } = useModal();

  const handleClick = () => {
    setOpen(
      <GlobalModal
        title="Update Workflow"
        subheading={`${workflow.name}`}
      >
        <Workflowform  workflow={workflow} />
      </GlobalModal>
    );
  };
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{workflow.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-500 mb-2">
          {new Date(workflow.updatedAt).toLocaleString()}
        </p>
        <p className="text-sm">{workflow.description}</p>
      </CardContent>
      <CardFooter className="flex items-center gap-2 justify-evenly flex-wrap">
        <Button variant={"outline"} className="w-fit">
          View Workflow
        </Button>
        <Button variant={"default"} onClick={handleClick} className="w-fit">
          <EditIcon />
        </Button>

        <Button variant={"destructive"} className="w-fit">
          <Trash2 />
        </Button>
      </CardFooter>
    </Card>
  );
}
