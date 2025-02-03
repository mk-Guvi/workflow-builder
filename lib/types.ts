/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { Edge, Node } from "@xyflow/react";

export const WorkflowFormSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  description: z.string().trim().min(1, "Required"),
});

export const NodeNameSchema = z.object({
  name: z.string().trim().min(1, 'Required'),
})



export type TNodeTypes = "WEBHOOK_NODE" | "CODE_NODE" | "WEBHOOK_RESPONSE_NODE";


export type AllNodesDataI = WebhookNodeDataI | WebhookResponseNodeDataI | CodeNodeDataI;

export interface AllNodesI extends Node {
  id: string;
  type: TNodeTypes;
  position: { x: number; y: number };
  workflowNodeId?: string;
  status?: "PENDING" | "COMPLETED" | "FAILED";
  data: {
    label: string;
    icon?: string;
    color?: string;
    description?: string; 
  }
}

export interface CodeNodeDataI  {
  parameters: {
    code: string;
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

export interface WebhookResponseNodeDataI {
  parameters: {
    respondWith: "TEXT" | "JSON";
    responseValue: string;
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

export interface WebhookNodeDataI {
  parameters: {
    method: "GET" | "POST";
    path: string;
    respondType: "IMMEDIATELY" | "LAST_NODE" | "RESPONSE_WEBHOOK";
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
  description: string;
  user_id: string;
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


export interface workflowHistoryT {
  id: string;
  workflowId: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}