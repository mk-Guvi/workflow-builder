import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string; executionId: string } }
) {
  try {
    const user_id = "1";
    const id = params.id;
    const executionId = params.executionId;

    if (!id|| !executionId)
      return Response.json(
        { error:true,message: "Workflow ID and ExecutionId is required" },
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

    return Response.json(
      {
        error: false,
        workflow,
        nodes: nodes?.map(({ positionX, positionY, ...rest }) => ({
          id: rest.id,
          type: rest.type,
          workflowNodeId: rest.workflowNodeId,
          position: { x: positionX, y: positionY },
          data:{
            label: rest.label,
            icon: rest.icon,
            color: rest.color,
            description: rest.description
          }
        })),
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
