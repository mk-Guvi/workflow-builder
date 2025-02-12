/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { JsonValue } from "@/lib/types";

// Helper function to validate node connections
export function getValidConnectedNodes(
  webhookNodeId: string,
  edges: { source: string; target: string }[]
): Set<string> {
  const validNodes = new Set<string>();
  const nodesWithIncoming = new Set<string>();
  const nodesWithOutgoing = new Set<string>();

  // First, collect all nodes with incoming and outgoing connections
  edges.forEach((edge) => {
    nodesWithOutgoing.add(edge.source);
    nodesWithIncoming.add(edge.target);
  });

  // Add webhook node as it's valid by default (only needs outgoing)
  validNodes.add(webhookNodeId);

  // Function to check if a node is properly connected
  function isValidNode(nodeId: string): boolean {
    // Webhook node only needs outgoing connections
    if (nodeId === webhookNodeId) {
      return nodesWithOutgoing.has(nodeId);
    }
    // Terminal nodes only need incoming connections
    if (!nodesWithOutgoing.has(nodeId)) {
      return nodesWithIncoming.has(nodeId);
    }
    // All other nodes need both incoming and outgoing connections
    return nodesWithIncoming.has(nodeId) && nodesWithOutgoing.has(nodeId);
  }

  // Helper function for depth-first traversal
  function traverse(currentNodeId: string) {
    // Get all outgoing edges for current node
    const outgoingEdges = edges.filter((edge) => edge.source === currentNodeId);

    for (const edge of outgoingEdges) {
      if (isValidNode(edge.target) && !validNodes.has(edge.target)) {
        validNodes.add(edge.target);
        traverse(edge.target);
      }
    }
  }

  // Start traversal from webhook node
  traverse(webhookNodeId);

  return validNodes;
}

interface ResponseParams {
  error: boolean;
  message?: string;
  data?: any;
  errorData?: any;
  status?: number;
  headers?: Record<string, string>;
}

export function createResponse({
  error,
  message,
  data,
  errorData,
  status = 200,
  headers = {},
}: ResponseParams) {
  const response: {
    error: boolean;
    message?: string;
    data?: string;
    errorData?: string;
  } = {
    error,
  };

  if (message) response.message = message;
  if (data) response.data = data;
  if (errorData) response.errorData = JSON.stringify(errorData);

  return NextResponse.json(response, { status, headers });
}

interface GetParsedValuesInput {
  executionId: string;
  code: string;
}

interface GetParsedValuesInput {
  executionId: string;
  code: string;
}

interface NodeMatch {
  fullMatch: string;
  nodeName: string;
  method: "currentItem" | "firstItem" | "lastItem" | "all";
}

export const getParsedValues = async ({
  executionId,
  code,
}: GetParsedValuesInput): Promise<{error:string, data:string}> => {
  try {
    // 1. Pattern matching with proper type handling
    const pattern =
      /\$\(['"]([^'"]+)['"]\)\.(currentItem|firstItem|lastItem|all)\.json/g;
    const matchResults = Array.from(code.matchAll(pattern));

    if (matchResults.length === 0) {
      return {
        error: '',
        data: code,
      };
    }

    // Transform matches into strongly-typed objects
    const matches: NodeMatch[] = matchResults.map((match) => ({
      fullMatch: match[0],
      nodeName: match[1],
      method: match[2] as NodeMatch["method"],
    }));

    // 2. Get unique node names from matches
    const nodeNamesSet = new Set(matches.map((m) => m.nodeName));
    const nodeNames = Array.from(nodeNamesSet);

    // 3. Get execution nodes
    const executionNodes = await db.executionNodes.findMany({
      where: {
        executionId: executionId,
        label: {
          in: nodeNames,
        },
      },
      select: {
        id: true,
        label: true,
        executions: {
          where: {
            status: "COMPLETED",
          },
          orderBy: {
            createdAt: "asc",
          },
          select: {
            outputJson: true,
            createdAt: true,
            status: true,
          },
        },
      },
    });

    // 4. Create node map
    const nodeMap = new Map<
      string,
      Array<{
        nodeId: string;
        executions: Array<{
          outputJson: JsonValue;
          createdAt: Date;
          status: string;
        }>;
      }>
    >();

    for (const node of executionNodes) {
      const existingNodes = nodeMap.get(node.label) || [];
      nodeMap.set(node.label, [
        ...existingNodes,
        {
          nodeId: node.id,
          executions: node.executions.map((execution) => ({
            outputJson: execution.outputJson as JsonValue,
            createdAt: execution.createdAt,
            status: execution.status,
          })),
        },
      ]);
    }

    // 5. Process matches and replace in code
    let parsedCode = code;

    for (const { fullMatch, nodeName, method } of matches) {
      const nodes = nodeMap.get(nodeName) || [];
      const values: JsonValue[] = [];

      for (const node of nodes) {
        const executions = node.executions;

        try {
          switch (method) {
            case "currentItem":
            case "lastItem": {
              const lastExecution = executions[executions.length - 1];
              if (lastExecution?.outputJson != null) {
                // Safely handle both string and object outputs
                if (typeof lastExecution.outputJson === 'string') {
                  try {
                    values.push(JSON.parse(lastExecution.outputJson));
                  } catch {
                    values.push(lastExecution.outputJson);
                  }
                } else {
                  values.push(lastExecution.outputJson);
                }
              }
              break;
            }
            case "firstItem": {
              const firstExecution = executions[0];
              if (firstExecution?.outputJson != null) {
                // Safely handle both string and object outputs
                if (typeof firstExecution.outputJson === 'string') {
                  try {
                    values.push(JSON.parse(firstExecution.outputJson));
                  } catch {
                    values.push(firstExecution.outputJson);
                  }
                } else {
                  values.push(firstExecution.outputJson);
                }
              }
              break;
            }
            case "all": {
              const validExecutions = executions
                .filter((e) => e.outputJson != null)
                .map((e) => {
                  if (typeof e.outputJson === 'string') {
                    try {
                      return JSON.parse(e.outputJson);
                    } catch {
                      return e.outputJson;
                    }
                  }
                  return e.outputJson;
                });
              values.push(...validExecutions);
              break;
            }
          }
        } catch (error) {
          console.error(`Error processing node ${nodeName}:`, error);
        }
      }

      // Create replacement
      const replacement =
        values.length === 0
          ? "null"
          : values.length === 1
          ? JSON.stringify(values[0])
          : JSON.stringify(values);

      parsedCode = parsedCode.replace(fullMatch, replacement);
    }

    return {
      error: "",
      data: parsedCode
    };
  } catch (error) {
    console.log(error);
    return {
      error: JSON.stringify(error),
      data: '',
    };
  }
};