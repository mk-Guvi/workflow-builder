/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { Edge, Node } from "@xyflow/react";

export const WorkflowFormSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
});

export type TNodeTypes = "WEBHOOK_NODE" | "CODE_NODE" | "WEBHOOK_RESPONSE_NODE";

interface CommonDataI{
  label: string;
  icon?: string;
  color?: string;
  description?: string; 
}
type AllNodesDataI = WebhookNodeDataI | WebhookResponseNodeDataI | CodeNodeDataI;

export interface AllNodesI extends Node {
  id: string;
  type: TNodeTypes;
  position: { x: number; y: number };
  data: AllNodesDataI&{[key:string]:unknown}
}

export interface CodeNodeDataI extends CommonDataI {
  parameters: {
    data: string;
    type: "JS";
  };
  settings: {
    retryOnFail: {
      isEnabled: boolean;
      maxTries: number;
      waitBetweenTries: number;
    };
    onError: "STOP" | "CONTINUE";
    notes: string;
  };
}

export interface WebhookResponseNodeDataI extends CommonDataI{
  parameters: {
    respondWith: "TEXT" | "JSON";
    responseCode?: number;
    responseHeaders: { label: string; value: string }[];
  };
  settings: {
    retryOnFail: {
      isEnabled: boolean;
      maxTries: number;
      waitBetweenTries: number;
    };
    onError: "STOP" | "CONTINUE";
    notes: string;
  };
}

export interface WebhookNodeDataI extends CommonDataI{
  parameters: {
    type: "GET" | "POST";
    path: string;
    respondType: "IMMEDIATELY" | "LAST_NODE" | "RESPONSE_WRBHOOOK";
  };
  settings: {
    allowMultipleHttps: boolean;
    notes: string;
  };
}



export interface LinkI extends Edge {
  id: string;
  source: string;
  target: string;
}

export type Workflow = {
  name: string;
  id: string;
  nodes: string[];
  edges: string[];
  description: string;
  userId: string;
  createdAt: Date;
  is_deleted: boolean;
  updatedAt: Date;
};

export type GetWorkflowsParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: "asc" | "desc";
};

export type GetWorkflowsResponse = {
  error?: string;
  workflows: Workflow[];
  metadata: {
    total: number;
    page: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    limit?: number;
  };
};
