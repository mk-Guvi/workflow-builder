import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TNodeTypes } from "@/lib/types";
import React, { useEffect } from "react";
import { useNodesEditor } from "../../hooks";
import WebhookNodeParameter from "./ParamsAndSettings/WebhookNode/WebhookNodeParameter";
import WebhookNodeSettings from "./ParamsAndSettings/WebhookNode/WebhookNodeSettings";
import WebhookResponseNodeParameter from "./ParamsAndSettings/WebhookResponseNode/WebhookResponseNodeParameter";
import WebhookResponseNodeSettings from "./ParamsAndSettings/WebhookResponseNode/WebhookResponseNodeSettings";
import CodeNodeParameter from "./ParamsAndSettings/CodeNode/CodeNodeParameter";
import CodeNodeSettings from "./ParamsAndSettings/CodeNode/CodeNodeSettings";
import LoadingSpinner from "@/components/loaders/SpinnerLoader";
import { useWorkflowStore } from "@/app/store";

const ParamsRenderer: Record<TNodeTypes, React.FC> = {
  WEBHOOK_NODE: WebhookNodeParameter,
  CODE_NODE: CodeNodeParameter,
  WEBHOOK_RESPONSE_NODE: WebhookResponseNodeParameter,
};

const SettingsRenderer: Record<TNodeTypes, React.FC> = {
  WEBHOOK_NODE: WebhookNodeSettings,
  CODE_NODE: CodeNodeSettings,
  WEBHOOK_RESPONSE_NODE: WebhookResponseNodeSettings,
};

function NodeSections() {
  const { nodeData } = useNodesEditor();
  const { nodesData, updateNodeData, workflowDetails } =
    useWorkflowStore();
  const ParamsView = (nodeData?.type && ParamsRenderer[nodeData?.type]) || null;
  const SettingsView =
    (nodeData?.type && SettingsRenderer[nodeData?.type]) || null;
  const [state, setState] = React.useState<{
    loading: boolean;
    error: string;
  }>({
    loading: false,
    error: "",
  });

  useEffect(() => {
    if (nodeData?.id) {
      if (nodesData?.[nodeData?.id]) {
        setState({
          loading: false,
          error: "",
        });
      } else {
        getNodeData();
      }
    }
  }, [nodeData]);

  const getNodeData = async () => {
    try {
      setState({
        loading: true,
        error: "",
      });
      const response = await fetch(
        `/api/workflows/${workflowDetails?.id}/getNodeData?nodeId=${nodeData?.id}`
      );
      const data = await response.json();
      if (data?.error === false) {
        setState({
          loading: false,
          error: "",
        });
        updateNodeData(`${nodeData?.id}`, {
          ...data?.data,
        });
      } else {
        if (data?.message) {
          setState({
            loading: false,
            error: data?.message,
          });
        } else {
          throw new Error("Something went wrong : Getting Node Data");
        }
      }
    } catch (e) {
      console.log(e);
      setState({
        loading: false,
        error: "Something went wrong",
      });
    }
  };

  return (
    <Tabs
      defaultValue="parameters"
      className="w-full p-2 overflow-auto flex relative flex-col h-full flex-1"
    >
      <LoadingSpinner isLoading={state.loading} />
      <TabsList className="w-fit mx-auto justify-start ">
        <TabsTrigger value="parameters">Parameters</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent
        value="parameters"
        className="w-full p-3 flex-1  overflow-auto"
      >
        {state?.error ? (
          <div className="flex items-center justify-center h-full text-red-500 font-bold text-center">
            {state.error}{" "}
          </div>
        ) : state?.loading ? null : (
          ParamsView && <ParamsView />
        )}
      </TabsContent>
      <TabsContent value="settings" className="w-full p-3 flex-1 overflow-auto">
        {state?.error ? (
          <div className="flex items-center justify-center h-full text-red-500 font-bold text-center">
            {state.error}{" "}
          </div>
        ) : state?.loading ? null : (
          SettingsView && <SettingsView />
        )}
      </TabsContent>
    </Tabs>
  );
}

export default NodeSections;
