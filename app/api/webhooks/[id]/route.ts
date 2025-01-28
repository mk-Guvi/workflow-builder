import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { executionNodes, executions, Prisma } from "@prisma/client";
import { AllNodesDataI, WebhookNodeDataI } from "@/lib/types";
import { getCurrentUTC } from "@/lib/utils";

export async function handler(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  let alreadyResponded = false;
  let executionId = "";

  if (!id) {
    alreadyResponded = true;
    return NextResponse.json(
      { error: "Webhook ID is required" },
      { status: 400 }
    );
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
      alreadyResponded = true;
      return NextResponse.json(
        { error: true, message: "Webhook node not found" },
        { status: 404 }
      );
    }

    if (webhook.method !== req.method) {
      alreadyResponded = true;
      return NextResponse.json(
        {
          error: true,
          message: `Invalid method. Expected ${webhook.method}, received ${req.method}.`,
        },
        { status: 405 }
      );
    }

    const webhookNodeData: WebhookNodeDataI = JSON.parse(
      `${webhook.node?.data || ""}`
    );

    // Initialize Workflow Execution
    const executionHistory = await db.executionsHistory.create({
      data: {
        workflowId: webhook.node!.workflowId,
        status: "RUNNING",
      },
    });
    executionId = executionHistory.id;

    // Helper function to safely create execution nodes
    const createExecutionNodes = async () => {
      const workflowNodes = await db.workflowNodes.findMany({
        where: { workflowId: webhook.node!.workflowId },
      });

      return Promise.all(
        workflowNodes.map(async (node) => {
          return db.executionNodes.create({
            data: {
              type: node.type,
              positionX: node.positionX,
              positionY: node.positionY,
              label: node.label,
              icon: node.icon,
              color: node.color,
              description: node.description,
              data: (node.data as Prisma.InputJsonValue) ?? Prisma.DbNull,
              executionId,
            },
          });
        })
      );
    };

    // Helper function to safely create execution edges
    const createExecutionEdges = async () => {
      const workflowEdges = await db.workflowEdges.findMany({
        where: { workflowId: webhook.node!.workflowId },
      });

      return Promise.all(
        workflowEdges.map(async (edge) =>
          db.executionEdges.create({
            data: {
              source: edge.source,
              target: edge.target,
              executionId,
            },
          })
        )
      );
    };

    const [executionNodes, executionEdges] = await Promise.all([
      createExecutionNodes(),
      createExecutionEdges(),
    ]);

    // Find the webhook execution node
    const webhookExecutionNode = executionNodes.find(
      (node) => node.id === webhook.nodeId
    );

    if (!webhookExecutionNode) {
      await db.executionsHistory.update({
        where: { id: executionHistory.id },
        data: { status: "FAILED", completedAt: getCurrentUTC() },
      });
      alreadyResponded = true;
      return NextResponse.json(
        { error: true, message: "Webhook node not found in execution flow" },
        { status: 500 }
      );
    }

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

    // Handle immediate response
    if (webhookNodeData.parameters?.respondType === "IMMEDIATELY") {
      NextResponse.json({
        error: false,
        message: "Workflow Started",
      });
      alreadyResponded = true;
    }

    // Node execution logic
    let currentNode: executionNodes | undefined = webhookExecutionNode;
    const currentExecution: executions = webhookExecution;

    while (currentNode) {
      try {
        // Move to next node
        const nextEdge = executionEdges.find(
          (edge) => edge.source === currentNode?.id
        );
        currentNode = nextEdge
          ? executionNodes.find((node) => node.id === nextEdge.target)
          : undefined;

        if (currentNode) {
          const nodeData = JSON.parse(`${currentNode.data || ""}`);

          let outputJson: Prisma.InputJsonValue = {};
          const newExecution = await db.executions.create({
            data: {
              nodeId: currentNode.id,
              status: "RUNNING",
              executionId,
            },
          });
          try {
            // Execute node based on type
            switch (currentNode.type) {
              case "CODE_NODE":
                // Implement actual code execution logic
                outputJson = {
                  result: "Code executed successfully",
                  output: nodeData.parameters?.code
                    ? `Executed code: ${nodeData.parameters.code.slice(
                        0,
                        100
                      )}...`
                    : null,
                };
                break;

              case "WEBHOOK_RESPONSE_NODE":
                outputJson = {
                  responseValue: nodeData.parameters?.responseValue || "OK",
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

            // Update node execution status
            await db.executions.update({
              where: { id: webhookExecution.id },
              data: {
                status: "COMPLETED",
                outputJson,
                completedAt: getCurrentUTC(),
              },
            });
          } catch (error: unknown) {
            console.log(error);
            await db.executions.update({
              where: { id: webhookExecution.id },
              data: {
                status: "FAILED",
                outputJson: { error } as Prisma.InputJsonValue,
                completedAt: getCurrentUTC(),
              },
            });

            if (nodeData.settings?.onError === "STOP") {
              currentNode = undefined;
              await db.executionsHistory.update({
                where: { id: executionHistory.id },
                data: { status: "FAILED", completedAt: getCurrentUTC() },
              });
            }
          }
        }
      } catch (error: unknown) {
        // Error handling
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        await db.executions.update({
          where: { id: webhookExecution.id },
          data: {
            status: "FAILED",
            outputJson: { error: errorMessage } as Prisma.InputJsonValue,
          },
        });

        const nodeData = JSON.parse(`${currentNode?.data || ""}`);

        if (nodeData?.parameters?.onError === "STOP") {
          await db.executionsHistory.update({
            where: { id: executionHistory.id },
            data: { status: "FAILED", completedAt: getCurrentUTC() },
          });
          
          currentNode = undefined;
        } else {
          // Continue to next node if configured
          const nextEdge = executionEdges.find(
            (edge) => edge.source === currentNode?.id
          );
          currentNode = nextEdge
            ? executionNodes.find((node) => node.id === nextEdge.target)
            : undefined;
        }
      }
    }

    // Final completion if no response node found
    await db.executionsHistory.update({
      where: { id: executionHistory.id },
      data: {
        status: "COMPLETED",
        completedAt: getCurrentUTC(),
      },
    });

    if (webhookNodeData.parameters?.respondType === "LAST_NODE") {
      alreadyResponded = true;
      return NextResponse.json({
        error: false,
        executionId: executionHistory.id,
        output: currentExecution.outputJson || {},
      });
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    await db.executionsHistory.update({
      where: { id: executionId },
      data: { status: "FAILED", completedAt: getCurrentUTC() },
    });
    console.log(errorMessage);
    if (!alreadyResponded) {
      return NextResponse.json(
        { error: true, message: `Webhook processing failed` },
        { status: 500 }
      );
    }
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
