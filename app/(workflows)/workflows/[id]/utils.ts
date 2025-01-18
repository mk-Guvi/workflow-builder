/* eslint-disable @typescript-eslint/no-explicit-any */
import {  TNodeTypes } from "@/lib/types";
import { z } from "zod";

export const onDragStart = (event: any, nodeType: TNodeTypes) => {
  event.dataTransfer.setData("application/reactflow", nodeType);
  event.dataTransfer.effectAllowed = "move";
};



export const WebhookNodeParamsSchema = z.object({
  path: z.string().trim().min(1, "Required"),
  method: z.enum(["GET", "POST",],{ required_error: "Required" }).default("GET"),
  respondType: z.enum(["IMMEDIATELY", "LAST_NODE", "RESPONSE_WEBHOOK"],{ required_error: "Required" }).default("IMMEDIATELY"),
});

export const WebhookNodeSettingsSchema = z.object({
  allowMultipleHttps: z.boolean().default(false),
  notes: z.string().trim(),
});

export const WebhookResponseNodeParamsSchema = z.object({
  respondWith: z.enum(["TEXT", "JSON"],{ required_error: "Required" }).default("TEXT"),
  responseCode: z.number().optional(),
  responseValue: z.string().trim(),
  responseHeaders: z.array(z.object({
    label: z.string().trim(),
    value: z.string().trim(),
  })).min(0),
});

export const WebhookResponseNodeSettingsSchema = z.object({
  retryOnFail: z.object({
    isEnabled: z.boolean().default(false),
    maxTries: z.number().min(1).default(1),
    waitBetweenTries: z.number().min(1).default(1),
  }),
  onError: z.enum(["STOP", "CONTINUE"],{ required_error: "Required" }).default("STOP"),
  notes: z.string().trim(),
})