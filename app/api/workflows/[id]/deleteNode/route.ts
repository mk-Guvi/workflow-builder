import { db } from "@/lib/db";

// Define types for better type safety
interface WebhookNodeData {
  parameters?: {
    method?: string;
    path?: string;
  };
}

interface DeleteRequestParams {
  params: {
    id: string;
  };
}

export const DELETE = async (req: Request, { params }: DeleteRequestParams) => {
  const user_id = "1";
  const id = params.id;

  try {
    const { nodeId } = await req.json();

    if (!id || !nodeId) {
      return Response.json(
        { error: "Workflow ID and Node ID are required" },
        { status: 400 }
      );
    }

    const workflow = await db.workflows.findFirst({
      where: { id, user_id, is_deleted: false },
    });

    if (!workflow) {
      return Response.json(
        { error: true, message: "Workflow not found" },
        { status: 404 }
      );
    }
    await db.workflowEdges.deleteMany({
        where: {
          OR: [{ source: nodeId }, { target: nodeId }],
        },
      });
    const node = await db.workflowNodes.findFirst({
      where: { id: nodeId },
    });
   

    if (!node) {
      return Response.json(
        { error: true, message: "Node not found" },
        { status: 404 }
      );
    }

    if (node.type === "WEBHOOK_NODE" && node.data) {
      let nodeData = null;
      try {
        nodeData = JSON.parse(node.data as string) as WebhookNodeData;
      } catch (error) {
        console.error("Error parsing node data:", error);
      }
      if (nodeData?.parameters?.method && nodeData?.parameters?.path) {
        await db.webhooks.delete({
          where: {
            nodeId,
          },
        });
      }
    }

    const res = await db.workflowNodes.delete({ where: { id: nodeId } });

    return Response.json(
      { message: "Node deleted successfully", node: res, error: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting node:", error);
    return Response.json(
      { error: true, message: "Failed to delete node" },
      { status: 500 }
    );
  }
};
