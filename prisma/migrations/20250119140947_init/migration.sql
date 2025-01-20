-- CreateEnum
CREATE TYPE "WebhookMethod" AS ENUM ('GET', 'POST', 'PUT', 'DELETE');

-- CreateTable
CREATE TABLE "webhooks" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "methods" "WebhookMethod"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "webhooks_path_key" ON "webhooks"("path");

-- AddForeignKey
ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
