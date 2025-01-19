import { db } from "@/lib/db";

export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const user_id = "1";
    const id = params.id;

    if(!id) return Response.json({ error: "Workflow ID is required" }, { status: 400 })

    const workflow = await db.workflows.findFirst({
      where: { id, user_id, is_deleted: false },
    });

    if (!workflow) {
      return Response.json({ error: true, message: "Workflow not found" }, { status: 404 });
    }

    const nodes = await db.workflowNodes.findMany({
      where: { workflowId: id },
      select: {
        id: true,
        workflowId: true,
        type: true,
        positionX: true,
        positionY: true,
        label: true,
        icon: true,
        color: true,
        description: true,
        createdAt: true,
        updatedAt: true 
        // Exclude 'data' by not including it here
      },
    });
    
    const edges = await db.workflowEdges.findMany({
      where: { workflowId: id },
    });

    return Response.json({ error: false, workflow, nodes, edges }, { status: 200 })

  } catch(e) {
    console.log(e)
    return Response.json({ error: true, message: "Something went wrong" }, { status: 500 })
  }
}