"use client";
import { Button } from "@/components/ui/button";
import React from "react";

const WorkflowDetailsHeader = () => {
  return (
    <div className="flex flex-row gap-6 justify-between items-center px-4 py-4 w-full dark:bg-black ">
      <h1 className="font-semibold text-lg">Workflows</h1>
      <Button>Save</Button>
    </div>
  );
};

export default WorkflowDetailsHeader;
