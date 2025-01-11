"use server";

import { db } from "@/lib/db";
import {
  GetWorkflowsParams,
  GetWorkflowsResponse,
  Workflow,
} from "@/lib/types";
import { Prisma } from "@prisma/client";

export const onCreateWorkflow = async (name: string, description: string) => {
  const userId = "1";

  if (userId) {
    //create new workflow
    const workflow = await db.workflows.create({
      data: {
        userId,
        name,
        description,
        nodes: [],
        edges: [],
      },
    });

    if (workflow) return { message: "workflow created" };
    return { message: "Oops! try again" };
  }
};

export const onUpdateWorkflow = async (workflowData: Partial<Workflow>) => {
  const userId = "1"; // Replace with actual user authentication logic

  if (!userId) {
    return { message: "Unauthorized" };
  }

  if (!workflowData?.id) {
    return { message: "Workflow ID is required for updating" };
  }

  try {
    // Update existing workflow
    const updatedWorkflow = await db.workflows.update({
      where: { id: workflowData?.id },
      data: {
        ...workflowData,
        updatedAt: new Date(),
      },
    });

    if (updatedWorkflow) {
      return {
        message: "Workflow updated successfully",
        workflow: updatedWorkflow,
      };
    } else {
      return { message: "Workflow not found or update failed" };
    }
  } catch (error) {
    console.error("Error updating workflow:", error);
    return {
      message: "Failed to update workflow",
      error: (error as Record<string, string>).message,
    };
  }
};

export const onGetWorkflows = async ({
  page = 1,
  limit = 10,
  search = "",
  sortOrder = "desc",
}: GetWorkflowsParams = {}): Promise<GetWorkflowsResponse> => {
  try {
    const userId = "1";

    if (!userId) {
      return {
        error: "Unauthorized",
        workflows: [],
        metadata: {
          total: 0,
          page: 0,
          totalPages: 0,
        },
      };
    }

    // Validate and sanitize input parameters
    const sanitizedLimit = Math.min(Math.max(1, limit), 100);
    const sanitizedPage = Math.max(1, page);
    const offset = (sanitizedPage - 1) * sanitizedLimit;

    // Build the where clause with correct Prisma types
    const whereClause: Prisma.workflowsWhereInput = {
      userId,
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    };

    // Get total count for pagination metadata
    const total = await db.workflows.count({
      where: whereClause,
    });

    // Get paginated and filtered results
    const workflows = await db.workflows.findMany({
      where: whereClause,
      orderBy: {
        id: sortOrder, // Using id for sorting since createdAt isn't available
      },
      take: sanitizedLimit,
      skip: offset,
    });

    const totalPages = Math.ceil(total / sanitizedLimit);

    return {
      workflows,
      metadata: {
        total,
        page: sanitizedPage,
        totalPages,
        hasNextPage: sanitizedPage < totalPages,
        hasPreviousPage: sanitizedPage > 1,
        limit: sanitizedLimit,
      },
    };
  } catch (error) {
    console.error("Error fetching workflows:", error);
    return {
      error: "Failed to fetch workflows",
      workflows: [],
      metadata: {
        total: 0,
        page: 0,
        totalPages: 0,
      },
    };
  }
};
