/*
  Warnings:

  - You are about to drop the `workflows` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `workflowId` to the `WorkflowEdge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workflowId` to the `WorkflowNode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkflowEdge" ADD COLUMN     "workflowId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WorkflowNode" ADD COLUMN     "workflowId" TEXT NOT NULL;

-- DropTable
DROP TABLE "workflows";

-- CreateTable
CREATE TABLE "Workflow" (
    "id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkflowNode" ADD CONSTRAINT "WorkflowNode_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowEdge" ADD CONSTRAINT "WorkflowEdge_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
