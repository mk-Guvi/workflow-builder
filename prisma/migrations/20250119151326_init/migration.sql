/*
  Warnings:

  - You are about to drop the column `methods` on the `webhooks` table. All the data in the column will be lost.
  - Added the required column `method` to the `webhooks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "webhooks" DROP COLUMN "methods",
ADD COLUMN     "method" "WebhookMethod" NOT NULL;
