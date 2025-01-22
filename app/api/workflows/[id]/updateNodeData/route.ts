import { db } from "@/lib/db";

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await req.json();
    const { id } = params;
    const { nodeId, data } = body;

    // Validate required fields
    if (!id || !nodeId) {
      return Response.json(
        { error: true, message: "Workflow ID and Node ID are required" },
        { status: 400 }
      );
    }

    // Verify the node exists and belongs to the workflow
    const node = await db.workflowNodes.findFirst({
      where: { id: nodeId, workflowId: id },
    });

    if (!node) {
      return Response.json(
        { error: true, message: "Node not found" },
        { status: 404 }
      );
    }

    if (node.type === "WEBHOOK_NODE") {
      // First check if there are any existing webhooks with the same path
      const existingWebhooks = await db.webhooks
        .findMany({
          where: {
            path: data?.parameters?.path,
          },
        })
        .catch((e) => {
          console.error("Error querying webhooks:", e);
          throw new Error("Error querying webhooks");
        });

      // Find webhook specific to this node
      const nodeWebhook = await db.webhooks.findFirst({
        where: {
          nodeId,
        },
      });

      // Check for path/method conflicts in other workflows
      const conflictingWebhook = existingWebhooks.find(
        (webhook) =>
          webhook.workflowId !== id &&
          webhook.method === data?.parameters?.method &&
          webhook.path === data?.parameters?.path
      );

      if (conflictingWebhook) {
        return Response.json(
          {
            error: true,
            message:
              "Webhook path and method combination already exists in another workflow",
          },
          { status: 400 }
        );
      }

      // Update or create webhook
      try {
        if (nodeWebhook) {
          // Update existing webhook

          await db.webhooks.update({
            where: { nodeId },
            data: {
              path: data?.parameters?.path,
              method: data?.parameters?.method || "GET",
              workflowId: id,
              nodeId,
            },
          });
        } else {
          // Create new webhook
          await db.webhooks.create({
            data: {
              path: data?.parameters?.path,
              workflowId: id,
              nodeId,
              method: data?.parameters?.method || "GET",
            },
          });
        }
      } catch (error) {
        console.error("Error updating/creating webhook:", error);
        return Response.json(
          { error: true, message: "Failed to update/create webhook" },
          { status: 500 }
        );
      }
    }

    // Update the node data
    const updatedNode = await db.workflowNodes.update({
      where: { id: nodeId },
      data: { data: JSON.stringify(data) },
    });

    return Response.json({ node: updatedNode, error: false });
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: true, message: "Something went wrong" },
      { status: 500 }
    );
  }
};
