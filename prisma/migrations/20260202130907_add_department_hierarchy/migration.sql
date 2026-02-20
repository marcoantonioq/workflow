-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "parent_code" TEXT;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_parent_code_fkey" FOREIGN KEY ("parent_code") REFERENCES "departments"("uorg_code") ON DELETE SET NULL ON UPDATE CASCADE;
