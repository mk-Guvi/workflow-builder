"use client";
import GlobalDrawer from "@/components/globals/GlobalDrawer";
import { Button } from "@/components/ui/button";
import React from "react";
import Workflowform from "../workflowForm";
import { useDrawer } from "@/app/providers/drawerProvider";



const WorkflowListingHeader = () => {
  const { setOpen } = useDrawer();
  

  const handleClick = () => {
    setOpen(
      <GlobalDrawer
        title="Create a Workflow Automation"
        subheading="Workflows are a powerfull that help you automate tasks."
      >
        <Workflowform />
      </GlobalDrawer>
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
