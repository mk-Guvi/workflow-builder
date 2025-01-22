import { db } from "@/lib/db";
import { AllNodesI, LinkI } from "@/lib/types";

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await req.json();
    const { id } = params;
    const { nodes, edges } = body as {
      nodes: AllNodesI[];
      edges: LinkI[];
    };


    // Validate required fields
    if (!id || !nodes || !edges) {
      return Response.json(
        { error: true, message: "Workflow ID, Nodes and Edges are required" },
        { status: 400 }
      );
    }
let hash_nodes_edges={}

    for (const edge of edges) {
      
    }

    for (const node of nodes) {
      await db.workflowNodes.update({
        where: { id: node.id },
        data: {
          positionX: node.position.x,
          positionY: node.position.y,
          color: node?.data?.color || '',
          label: node?.data?.label || '',
          icon: node?.data?.icon || '',
          description: node?.data?.description || '',
          
          type: node.type,
        },
      });
    }
   

    return Response.json({ error: false, message: "Workflow updated" });
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: true, message: "Something went wrong" },
      { status: 500 }
    );
  }
};
