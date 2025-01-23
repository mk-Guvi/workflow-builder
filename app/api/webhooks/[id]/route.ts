import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function handler(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Webhook ID is required" },
      { status: 400 }
    );
  }

  const webhook = await db.webhooks.findFirst({
    where: { path: id },
  });

  if (!webhook) {
    return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
  }

  
  if (webhook.method !== req.method) {
    return NextResponse.json(
      {
        error: `Invalid method.`,
      },
      { status: 405 }
    );
  }
  const getNodes = await db.workflowNodes.findMany({
    where: { workflowId: webhook.workflowId },
  });
  const getEdges = await db.workflowEdges.findMany({
    where: { workflowId: webhook.workflowId },
  });
  return NextResponse.json({
    success: true,
    message: `Webhook ${id} processed successfully.`,
    data: {
      nodes: getNodes,
      edges: getEdges,
      req:{
        body:req.json(),
        headers:req.headers,
        method:req.method,
        url:req.url
      }
    },
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
  handler as OPTIONS,
};
