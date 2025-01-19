/*
  Warnings:

  - You are about to drop the `WorkflowEdges` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkflowNodes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Workflows` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkflowEdges" DROP CONSTRAINT "WorkflowEdges_sourceId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowEdges" DROP CONSTRAINT "WorkflowEdges_targetId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowEdges" DROP CONSTRAINT "WorkflowEdges_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowNodes" DROP CONSTRAINT "WorkflowNodes_workflowId_fkey";

-- DropTable
DROP TABLE "WorkflowEdges";

-- DropTable
DROP TABLE "WorkflowNodes";

-- DropTable
DROP TABLE "Workflows";

-- CreateTable
CREATE TABLE "workflows" (
    "id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflowNodes" (
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

    CONSTRAINT "workflowNodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflowEdges" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflowEdges_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "workflowNodes" ADD CONSTRAINT "workflowNodes_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflowEdges" ADD CONSTRAINT "workflowEdges_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflowEdges" ADD CONSTRAINT "workflowEdges_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "workflowNodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflowEdges" ADD CONSTRAINT "workflowEdges_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "workflowNodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
