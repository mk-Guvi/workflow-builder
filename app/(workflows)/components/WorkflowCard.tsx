"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Workflow } from "@/lib/types";
import { EditIcon, Trash2 } from "lucide-react";
import Workflowform from "./workflowForm";
import Link from "next/link";
import GlobalModal from "@/components/globals/GlobalModal";
import { useModal } from "@/app/providers/modalProvider";
import { onDeleteWorkflow } from "../_actions/workflowsActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type WorkflowCardProps = {
  workflow: Workflow;
};

export default function WorkflowCard({ workflow }: WorkflowCardProps) {
  const { setOpen } = useModal();
  const router = useRouter();
  const { setOpen: setOpenModal,setClose } = useModal();

  const handleClick = () => {
    setOpen(
      <GlobalModal title="Update Workflow" subTitle={`${workflow.name}`}>
        <Workflowform workflow={workflow} />
      </GlobalModal>
    );
  };
  const onDelete = async () => {
    const response = await onDeleteWorkflow(workflow.id);
    if (!response?.error) {
      toast.message(response.message);
      setClose()
      router.refresh();
    } else {
      toast.error(response.message);
    }
  };
  const handleDelete = () => {
    setOpenModal(
      <GlobalModal title="Delete Workflow" onConfirm={onDelete}>
        <p>
          Are you sure ,You want to delete <b>{workflow.name}?</b>
        </p>
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
        <Link href={`/workflows/${workflow?.id}`}>
          <Button variant={"outline"} className="w-fit">
            View Workflow
          </Button>
        </Link>
        <Button variant={"default"} onClick={handleClick} className="w-fit">
          <EditIcon />
        </Button>

        <Button
          variant={"destructive"}
          onClick={handleDelete}
          className="w-fit"
        >
          <Trash2 />
        </Button>
      </CardFooter>
    </Card>
  );
}
