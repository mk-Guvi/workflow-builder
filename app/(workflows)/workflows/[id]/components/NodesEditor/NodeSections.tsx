import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {  TNodeTypes } from "@/lib/types";
import React from "react";
import { useNodesEditor } from "./hooks";
import WebhookNodeParameter from "./ParamsAndSettings/WebhookNode/WebhookNodeParameter";
import WebhookNodeSettings from "./ParamsAndSettings/WebhookNode/WebhookNodeSettings";
import WebhookResponseNodeParameter from "./ParamsAndSettings/WebhookResponseNode/WebhookResponseNodeParameter";
import WebhookResponseNodeSettings from "./ParamsAndSettings/WebhookResponseNode/WebhookResponseNodeSettings";

const ParamsRenderer: Record<TNodeTypes, React.FC> = {
  WEBHOOK_NODE: WebhookNodeParameter,
  CODE_NODE: WebhookNodeParameter,
  WEBHOOK_RESPONSE_NODE: WebhookResponseNodeParameter,
};

const SettingsRenderer: Record<TNodeTypes, React.FC> = {
  WEBHOOK_NODE: WebhookNodeSettings,
  CODE_NODE: WebhookNodeSettings,
  WEBHOOK_RESPONSE_NODE: WebhookResponseNodeSettings,
};

function NodeSections() {
  const { nodeData } = useNodesEditor();
  const ParamsView = nodeData?.type && ParamsRenderer[nodeData?.type] || null;
  const SettingsView =nodeData?.type && SettingsRenderer[nodeData?.type] || null;
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
      >
        {ParamsView && <ParamsView />}
      </TabsContent>
      <TabsContent
        value="settings"
        className="w-full p-3 flex-1 overflow-auto"
      >
        {SettingsView && <SettingsView />}
      </TabsContent>
    </Tabs>
  );
}

export default NodeSections;
