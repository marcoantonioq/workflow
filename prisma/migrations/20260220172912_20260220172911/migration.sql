/*
  Warnings:

  - You are about to drop the column `access_role` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "access_role",
ADD COLUMN     "access_rule" TEXT,
ADD COLUMN     "main_activities" TEXT,
ADD COLUMN     "pgd" TEXT,
ADD COLUMN     "role" TEXT;
