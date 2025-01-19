/*
  Warnings:

  - You are about to drop the `Workflow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkflowEdge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkflowNode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkflowEdge" DROP CONSTRAINT "WorkflowEdge_sourceId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowEdge" DROP CONSTRAINT "WorkflowEdge_targetId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowEdge" DROP CONSTRAINT "WorkflowEdge_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowNode" DROP CONSTRAINT "WorkflowNode_workflowId_fkey";

-- DropTable
DROP TABLE "Workflow";

-- DropTable
DROP TABLE "WorkflowEdge";

-- DropTable
DROP TABLE "WorkflowNode";

-- CreateTable
CREATE TABLE "Workflows" (
    "id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowNodes" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "type" "NodeType" NOT NULL,
    "positionX" DOUBLE PRECISION NOT NULL,
    "positionY" DOUBLE PRECISION NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "description" TEXT,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowNodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowEdges" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowEdges_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkflowNodes" ADD CONSTRAINT "WorkflowNodes_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowEdges" ADD CONSTRAINT "WorkflowEdges_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowEdges" ADD CONSTRAINT "WorkflowEdges_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "WorkflowNodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowEdges" ADD CONSTRAINT "WorkflowEdges_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "WorkflowNodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
