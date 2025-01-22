import { db } from "@/lib/db";
import { v4 } from "uuid";

export const POST = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    if (!db) {
      console.error("Database client is not initialized");
      return Response.json(
        {
          message: "Database connection failed",
          error: true,
        },
        { status: 500 }
      );
    }

    const user_id = "1"; // Replace with actual user authentication logic

    if (!user_id) {
      return Response.json(
        {
          message: "Unauthorized",
          error: true,
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { label, type, positionX, positionY } = body;

    if (!label || !type || positionX == null || positionY == null) {
      return Response.json(
        {
          message: "Missing required parameters",
          error: true,
        },
        { status: 400 }
      );
    }

    const nodeId = v4();
    let nodeData = {};

    // First create the node
    if (type === "WEBHOOK_NODE") {
      const webhookPath = v4(); // Generate a unique path for the webhook
      nodeData = {
        parameters: {
          method: "GET",
          path: webhookPath,
          respondType: "IMMEDIATELY",
        },
        settings: {
          allowMultipleHttps: false,
          notes: "",
        },
      };
    }

    // Create the node first
    const node = await db.workflowNodes.create({
      data: {
        id: nodeId,
        workflowId: params.id,
        type,
        positionX,
        positionY,
        data: JSON.stringify(nodeData),
        label,
      },
    });

    // Then create the webhook if it's a webhook node
    if (type === "WEBHOOK_NODE") {
      try {
        // Check if webhook already exists
        const webhook = await db.webhooks.findFirst({
          where: {
            workflowId: params.id,
            path: nodeId,
          },
        });

        if (webhook) {
          // If webhook exists, delete the node we just created
          await db.workflowNodes.delete({
            where: { id: nodeId },
          });

          return Response.json(
            {
              message: "Webhook path already exists",
              error: true,
            },
            { status: 400 }
          );
        }

        // Create new webhook
        await db.webhooks.create({
          data: {
            path: nodeId,
            nodeId: node.id,
            workflowId: params.id,
            method: "GET",
          },
        });
      } catch (webhookError) {
        // If webhook creation fails, delete the node we created
        await db.workflowNodes.delete({
          where: { id: nodeId },
        });

        console.error("Webhook creation error:", webhookError);
        return Response.json(
          {
            message: "Failed to process webhook",
            error: true,
          },
          { status: 500 }
        );
      }
    }

    return Response.json(
      {
        message: "Node added successfully",
        node: {
          id: node.id,
          type,
          position: {
            positionX,
            positionY,
          },
          data: {
            label,
            description: "",
          },
        },
        error: false,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("Full error in addNode route:", e);
    return Response.json(
      {
        message: "Something went wrong",
        error: true,
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
