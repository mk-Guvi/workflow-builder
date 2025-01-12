"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import Workflowform from "../workflowForm";
import { useModal } from "@/app/providers/modalProvider";
import GlobalModal from "@/components/globals/GlobalModal";

const WorkflowListingHeader = () => {
  const { setOpen } = useModal();

  const handleClick = () => {
    setOpen(
      <GlobalModal
        title="Create a Workflow Automation"
        subTitle="Workflows are a powerfull that help you automate tasks."
      >
        <Workflowform />
      </GlobalModal>
    );
  };

  return (
    <div className="flex flex-row gap-6 justify-between items-center px-4 py-4 w-full dark:bg-black ">
      <h1 className="font-semibold text-lg">Workflows</h1>
      <Button onClick={handleClick}>Add Worfklow</Button>
    </div>
  );
};

export default WorkflowListingHeader;
