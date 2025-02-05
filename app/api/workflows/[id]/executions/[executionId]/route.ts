import { db } from "@/lib/db";
import { AllNodesI } from "@/lib/types";

export async function GET(
  request: Request,
  { params }: { params: { id: string; executionId: string } }
) {
  try {
    const user_id = "1";
    const id = params.id;
    const executionId = params.executionId;

    if (!id || !executionId)
      return Response.json(
        { error: true, message: "Workflow ID and ExecutionId is required" },
        { status: 400 }
      );

    const workflow = await db.workflows.findFirst({
      where: { id, user_id, is_deleted: false },
    });

    if (!workflow) {
      return Response.json(
        { error: true, message: "Workflow not found" },
        { status: 404 }
      );
    }

    const nodes = await db.executionNodes.findMany({
      where: { executionId },
      select: {
        id: true,
        executionId: true,
        type: true,
        positionX: true,
        positionY: true,
        label: true,
        icon: true,
        color: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        workflowNodeId: true,
      },
    });

    const edges = await db.executionEdges.findMany({
      where: { executionId },
    });
    
    const hashedNodes = nodes.reduce(
      (acc, { positionX, positionY, ...rest }) => ({
        ...acc,
        [rest.id]: {
          id: rest.id,
          type: rest.type,
          workflowNodeId: rest.workflowNodeId,
          position: { x: positionX, y: positionY },
          data: {
            label: rest.label,
            icon: rest.icon,
            color: rest.color,
            description: rest.description,
          },
        } as AllNodesI,
      }),
      {} as Record<string, AllNodesI>
    );
    // Step 1: Extract all nodeIds from hashedNodes
    const nodeIds = Object.keys(hashedNodes);

    // Step 2: Query the database to get the status and outputJson for each node
    const nodeStatus = await db.executions.findMany({
      where: {
        executionId,
        nodeId: { in: nodeIds }, // Use 'in' to filter by multiple nodeIds
      },
      select: {
        status: true,
        nodeId: true, // Include nodeId in the result to map back to hashedNodes
      },
    });

    // Step 3: Aggregate the status counts for each node
    const statusCounts = nodeStatus.reduce((acc, { nodeId, status }) => {
      if (!acc[nodeId]) {
        acc[nodeId] = {};
      }
      if (!acc[nodeId][status]) {
        acc[nodeId][status] = 0;
      }
      acc[nodeId][status] += 1;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    // Step 4: Add the status counts to the corresponding nodes in hashedNodes
    const updatedHashedNodes = Object.keys(hashedNodes).reduce(
      (acc, nodeId) => {
        const node = hashedNodes[nodeId];
        const counts = statusCounts[nodeId] || {};
        acc[nodeId] = {
          ...node,
          data: {
            ...node.data,
            statusCounts: counts,
          },
        };
        return acc;
      },
      {} as Record<string, AllNodesI>
    );

    
    return Response.json(
      {
        error: false,
        workflow,
        nodes:Object.values(updatedHashedNodes),
        edges,
      },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return Response.json(
      { error: true, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
