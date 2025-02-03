import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return Response.json(
        { error: true, message: "Workflow ID is required" },
        { status: 400 }
      );
    }

    // Extract query params
    const { searchParams } = new URL(request.url);
    const page_number = parseInt(searchParams.get("page_number") || "1", 10);
    const page_size = Math.min(
      parseInt(searchParams.get("page_size") || "10", 10),
      100
    ); // Max 100

    if (page_number < 1 || page_size < 1) {
      return Response.json(
        { error: true, message: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    // Check if workflow exists
    const workflow = await db.workflows.findUnique({
      where: { id },
    });

    if (!workflow) {
      return Response.json(
        { error: true, message: "Workflow not found" },
        { status: 404 }
      );
    }

    // Fetch workflow history with pagination
    const total_records = await db.executionsHistory.count({
      where: { workflowId: id },
    });

    const total_pages = Math.ceil(total_records / page_size);
    const result = await db.executionsHistory.findMany({
      where: { workflowId: id },
      orderBy: { createdAt: "desc" },
      take: page_size,
      skip: (page_number - 1) * page_size,
    });

    return Response.json(
      {
        error: false,
        data: {
          current_page: page_number,
          total_pages,
          total_records,
          result,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return Response.json(
      { error: true, message: "Failed to get workflow history" },
      { status: 500 }
    );
  }
}
