import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user_id = "1"; // TODO: Get actual user_id from auth
    const { id } = params;
    
    // Get nodeId from searchParams
    const searchParams = new URL(request.url).searchParams;
    const nodeId = searchParams.get("nodeId");

    if (!id || !nodeId) {
      return Response.json(
        { error: true, message: "Workflow ID and Node ID are required" },
        { status: 400 }
      );
    }

    // First check if workflow exists and belongs to user
    const workflow = await db.workflows.findFirst({
      where: {
        id,
        user_id,
        is_deleted: false,
      },
    });

    if (!workflow) {
      return Response.json(
        { error: true, message: "Workflow not found" },
        { status: 404 }
      );
    }

    // Then get the specific node
    const node = await db.workflowNodes.findFirst({
      where: {
        id: nodeId,
        workflowId: id,
      },
    });

    if (!node) {
      return Response.json(
        { error: true, message: "Node not found" },
        { status: 404 }
      );
    }

    // Parse the node data
    let data: any = null;
    try {
      if (node.data) {
        data = JSON.parse(node.data as string);
      } else {
        throw new Error("Node data is empty");
      }
    } catch (error) {
      console.error("Error parsing node data:", error);
      return Response.json(
        { error: false,data:{} },
      );
    }

    return Response.json(
      {
        error: false,
        data,
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Server error:", error);
    return Response.json(
      { error: true, message: "Internal server error" },
      { status: 500 }
    );
  }
}