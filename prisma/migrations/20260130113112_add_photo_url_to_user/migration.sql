-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "faq" JSONB DEFAULT '[]';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "photo_url" TEXT;
