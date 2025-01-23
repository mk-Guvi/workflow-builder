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
    const getAllEdges = await db.workflowEdges.findMany({
      where: { workflowId: id },
    });
    const hashed_edges: Record<
      string,
      Pick<LinkI, "source" | "target">
    > = getAllEdges.reduce((acc, edge) => {
      acc[edge.id] = { source: edge.source, target: edge.target };
      return acc;
    }, {} as Record<string, Pick<LinkI, "source" | "target">>);

    for (const edge of edges) {
      if (!hashed_edges[edge.id]) {
        await db.workflowEdges.create({
          data: {
            source: edge.source,
            target: edge.target,
            workflowId: id,
            id: edge.id,
          },
        });
      } else {
        await db.workflowEdges.update({
          where: { id: edge.id },
          data: {
            source: edge.source,
            target: edge.target,
          },
        });
      }
    }

    for (const node of nodes) {
      await db.workflowNodes.update({
        where: { id: node.id },
        data: {
          positionX: node.position.x,
          positionY: node.position.y,
          color: node?.data?.color || "",
          label: node?.data?.label || "",
          icon: node?.data?.icon || "",
          description: node?.data?.description || "",
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
