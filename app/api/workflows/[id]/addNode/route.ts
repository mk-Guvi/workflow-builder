import { db } from "@/lib/db";
import { v4 } from "uuid";

export const POST = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    // Verify db is correctly imported and initialized
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
    if (type === "WEBHOOK_NODE") {
      try {
        // First verify the webhooks table exists
        const webhook = await db.webhooks
          .findFirst({
            where: { workflowId: params.id, path: nodeId },
          })
          .catch((e) => {
            console.error("Error querying webhook:", e);
            return null;
          });

        if (webhook) {
          return Response.json(
            {
              message: "Webhook node already exists",
              error: true,
            },
            { status: 400 }
          );
        }

        // Create new webhook
        const newWebhook = await db.webhooks.create({
          data: {
            path: nodeId,
            workflowId: params.id,
            method: "GET",
          },
        });

        if (!newWebhook?.id) {
          throw new Error("Failed to create webhook");
        } else {
          nodeData = {
            parameters: {
              method: "GET",
              path: nodeId,
              respondType: "IMMEDIATELY",
            },
            method: "GET",
            path: nodeId,
            respondType: "IMMEDIATELY",
            settings: {
              allowMultipleHttps: false,
              notes: "",
            },
            allowMultipleHttps: false,
            notes: "",
          };
        }
      } catch (webhookError) {
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

    const node = await db.workflowNodes.create({
      data: {
        workflowId: params.id,
        type,
        positionX,
        positionY,
        data: JSON.stringify(nodeData),
        label,
      },
    });

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
