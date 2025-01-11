import { z } from 'zod'

export const WorkflowFormSchema = z.object({
    name: z.string().min(1, 'Required'),
    description: z.string().min(1, 'Required'),
  })
  

  export type Workflow = {
    name: string;
    id: string;
    nodes: string[];
    edges: string[];
    description: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type GetWorkflowsParams = {
    page?: number;
    limit?: number;
    search?: string;
    sortOrder?: "asc" | "desc";
  }
  
  export type GetWorkflowsResponse = {
    error?: string;
    workflows: Workflow[];
    metadata: {
      total: number;
      page: number;
      totalPages: number;
      hasNextPage?: boolean;
      hasPreviousPage?: boolean;
      limit?: number;
    };
  };
  
  