import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string; executionId: string } }
) {
  try {
    const user_id = "1";
    const id = params.id;
    const executionId = params.executionId;
    const nodeId = new URL(request.url).searchParams.get("nodeId");

    if (!id || !executionId)
      return Response.json(
        { error: true, message: "Workflow ID and ExecutionId is required" },
        { status: 400 }
      );

    const workflow = await db.workflows.findFirst({
      where: { id, user_id, is_deleted: false },
    });

    if (!workflow || !nodeId) {
      return Response.json(
        { error: true, message: "Workflow not found" },
        { status: 404 }
      );
    }

    const nodeData = await db.executionNodes.findFirst({
      where: { executionId, workflowNodeId: nodeId },
    });

    const outputData = await db.executions.findMany({
      where: { executionId, nodeId:nodeData?.id },
      select:{
        status:true,
        outputJson:true
      }
    });

    return Response.json(
      {
        error: false,
        nodeData:{
          ...JSON.parse(`${nodeData?.data}`),
          outputData
        },
        
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
