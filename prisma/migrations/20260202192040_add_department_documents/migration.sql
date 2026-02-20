-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "documents" JSONB DEFAULT '[]';

-- AlterTable
ALTER TABLE "workflows" ALTER COLUMN "documents" DROP NOT NULL,
ALTER COLUMN "structure" DROP NOT NULL;
