import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";


function NodeSections() {
 
  return (
    <Tabs
      defaultValue="parameters"
      className="w-full p-2 overflow-auto flex flex-col h-full flex-1"
    >
      <TabsList className="w-fit mx-auto justify-start ">
        <TabsTrigger value="parameters">Parameters</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent
        value="parameters"
        className="w-full p-3 flex-1  overflow-auto"
      ></TabsContent>
      <TabsContent
        value="settings"
        className="w-full p-3 flex-1 overflow-auto"
      ></TabsContent>
    </Tabs>
  );
}

export default NodeSections;
