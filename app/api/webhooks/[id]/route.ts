import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { executionNodes, executions, Prisma } from "@prisma/client";
import { WebhookNodeDataI, WebhookResponseNodeDataI } from "@/lib/types";
import { getCurrentUTC } from "@/lib/utils";
import { runJsScript } from "./services/CodeNodeServices";
import {
  createResponse,
  getParsedValues,
  getValidConnectedNodes,
} from "./helpers";

async function handler(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  let executionId = "";
  let outputJson: Prisma.InputJsonValue = {};

  if (!id) {
    return createResponse({
      error: true,
      message: "Webhook ID is required",
      status: 400,
    });
  }

  try {
    const webhook = await db.webhooks.findFirst({
      where: { path: id },
      include: {
        node: {
          include: {
            workflow: true,
          },
        },
      },
    });

    if (!webhook?.node) {
      return createResponse({
        error: true,
        message: "Webhook node not found",
        status: 400,
      });
    }

    if (webhook.method !== req.method) {
      return createResponse({
        error: true,
        message: `Invalid method.`,
        status: 405,
      });
    }

    const webhookNodeData: WebhookNodeDataI = JSON.parse(
      `${webhook.node?.data || ""}`
    );

    // Initialize Workflow Execution
    const executionHistory = await db.executionsHistory.create({
      data: {
        workflowId: webhook.node!.workflowId,
        status: "PENDING",
      },
    });
    executionId = executionHistory.id;

    // Get workflow nodes and edges
    const [workflowNodes, workflowEdges] = await Promise.all([
      db.workflowNodes.findMany({
        where: { workflowId: webhook.node.workflowId },
      }),
      db.workflowEdges.findMany({
        where: { workflowId: webhook.node.workflowId },
      }),
    ]);

    // Create execution nodes with a nodeMapping
    const nodeMapping = new Map<string, string>();
    const reverseNodeMapping = new Map<string, string>();

    const executionNodes = await Promise.all(
      workflowNodes.map(async (node) => {
        const executionNode = await db.executionNodes.create({
          data: {
            type: node.type,
            positionX: node.positionX,
            positionY: node.positionY,
            label: node.label,
            icon: node.icon,
            workflowNodeId: node.id,
            color: node.color,
            description: node.description,
            data: (node.data as Prisma.InputJsonValue) ?? Prisma.DbNull,
            executionId,
          },
        });
        nodeMapping.set(node.id, executionNode.id);
        reverseNodeMapping.set(executionNode.id, node.id);
        return executionNode;
      })
    );

    // Create execution edges using the nodeMapping
    const executionEdges = await Promise.all(
      workflowEdges.map(async (edge) => {
        const sourceNodeId = nodeMapping.get(edge.source);
        const targetNodeId = nodeMapping.get(edge.target);

        if (!sourceNodeId || !targetNodeId) {
          throw new Error(`Missing node mapping for edge: ${edge.id}`);
        }

        return db.executionEdges.create({
          data: {
            source: sourceNodeId,
            target: targetNodeId,
            executionId,
          },
        });
      })
    );

    // Find the webhook execution node
    const webhookExecutionNode = executionNodes.find(
      (node) => node.workflowNodeId === webhook.nodeId
    );

    if (!webhookExecutionNode) {
      await db.executionsHistory.update({
        where: { id: executionId },
        data: { status: "FAILED", completedAt: getCurrentUTC() },
      });
      return createResponse({
        error: true,
        message: "Webhook node not found in execution flow",
        status: 500,
      });
    }

    // Get all valid connected nodes from the webhook node
    const validNodeIds = getValidConnectedNodes(
      webhookExecutionNode.id,
      executionEdges.map((edge) => ({
        source: edge.source,
        target: edge.target,
      }))
    );

    // Create initial execution record
    const requestBody = await req.json().catch(() => ({}));
    const webhookExecution = await db.executions.create({
      data: {
        executionId: executionHistory.id,
        nodeId: webhookExecutionNode.id,
        status: "COMPLETED",
        completedAt: getCurrentUTC(),
        outputJson: {
          headers: Object.fromEntries(req.headers),
          body: requestBody,
          params: Object.fromEntries(req.nextUrl.searchParams),
        } as Prisma.InputJsonValue,
      },
    });

    if (webhookNodeData.parameters?.respondType === "IMMEDIATELY") {
      return createResponse({
        error: false,
        message: "Workflow Started",
        data: { executionId: webhookExecution.id },
      });
    }

    // Node execution logic
    let currentNode: executionNodes | undefined = webhookExecutionNode;
    let lastWebhookResponseNode: executionNodes | undefined;
    let lastWebhookResponseData: WebhookResponseNodeDataI | undefined;

    while (currentNode) {
      let currentExecution: executions | undefined = webhookExecution;
      try {
        // Move to next node
        const nextEdge = executionEdges.find(
          (edge) => edge.source === currentNode?.id
        );
        currentNode = nextEdge
          ? executionNodes.find((node) => node.id === nextEdge.target)
          : undefined;

        // Skip if the node is not in the valid set
        if (currentNode && !validNodeIds.has(currentNode.id)) {
          currentNode = undefined;
          continue;
        }

        if (currentNode) {
          const nodeData = JSON.parse(`${currentNode.data || ""}`);

          const newExecution = await db.executions.create({
            data: {
              nodeId: currentNode.id,
              status: "PENDING",
              executionId,
            },
          });
          currentExecution = newExecution;
          switch (currentNode.type) {
            case "CODE_NODE":
              const code = nodeData.parameters?.code || "";
              const result= await getParsedValues({ code, executionId });
              if(result.error){
                throw new Error(result.error);
              }
              const executionOptions = {
                timeout: nodeData.settings?.timeout || 10000,
              };
              let d=''
              try{
                d=JSON.parse(result.data);
              }catch(e){
                console.log(e)
                d=result.data
              }

              const { logs, data, error, executionTime } = await runJsScript(
                d,
                executionOptions
              );
              console.log({ data, error, code: result.data });
              if (error) {
                throw new Error(error);
              }

              outputJson = {
                logs,
                result: data,
                executionTime,
              };
              
              break;

            case "WEBHOOK_RESPONSE_NODE":
              lastWebhookResponseNode = currentNode;
              lastWebhookResponseData = nodeData as WebhookResponseNodeDataI;
              const parsedResponse= await getParsedValues({ code:nodeData.parameters?.responseValue, executionId });
              if(parsedResponse.error){
                throw new Error(parsedResponse.error);
              }
              outputJson = {
                responseValue: parsedResponse.data || "",
                responseCode: nodeData.parameters?.responseCode || 200,
                responseHeaders: nodeData.parameters?.responseHeaders || [],
              };
              break;

            default:
              outputJson = {
                message: "Node processed",
                type: currentNode.type,
              };
          }

          await db.executions.update({
            where: { id: currentExecution.id, nodeId: currentNode?.id },
            data: {
              status: "COMPLETED",
              outputJson,
              completedAt: getCurrentUTC(),
            },
          });
        }
      } catch (error) {
        if (currentExecution?.id) {
          await db.executions.update({
            where: { id: currentExecution.id, },
            data: {
              status: "FAILED",
              outputJson: { error: JSON.stringify(error) },
              completedAt: getCurrentUTC(),
            },
          });
        }

        const nodeData = JSON.parse(`${currentNode?.data || ""}`);
        if (nodeData?.settings?.onError === "STOP") {
          await db.executionsHistory.update({
            where: { id: executionHistory.id },
            data: { status: "FAILED", completedAt: getCurrentUTC() },
          });
          currentNode = undefined;
        } else {
          const nextEdge = executionEdges.find(
            (edge) => edge.source === currentNode?.id
          );
          currentNode = nextEdge
            ? executionNodes.find((node) => node.id === nextEdge.target)
            : undefined;
        }
      }
    }

    await db.executionsHistory.update({
      where: { id: executionHistory.id },
      data: {
        status: "COMPLETED",
        completedAt: getCurrentUTC(),
      },
    });

    if (
      webhookNodeData.parameters?.respondType === "RESPONSE_WEBHOOK" &&
      lastWebhookResponseNode &&
      lastWebhookResponseData
    ) {
      return createResponse({
        error: false,
        data: lastWebhookResponseData.parameters.responseValue,
        status: lastWebhookResponseData.parameters.responseCode || 200,
        headers: Object.fromEntries(
          lastWebhookResponseData.parameters.responseHeaders.map((h) => [
            h.label,
            h.value,
          ])
        ),
      });
    }

    if (webhookNodeData.parameters?.respondType === "LAST_NODE") {
      return createResponse({
        error: false,
        data: outputJson || {},
      });
    }

    return createResponse({
      error: false,
      message: "Workflow Completed",
      data: outputJson || {},
    });
  } catch (error: unknown) {
    if (executionId) {
      await db.executionsHistory.update({
        where: { id: executionId },
        data: { status: "FAILED", completedAt: getCurrentUTC() },
      });
    }
    console.error(error);
    return createResponse({
      error: true,
      message: "Webhook processing failed",
      status: 500,
    });
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
  handler as OPTIONS,
};
