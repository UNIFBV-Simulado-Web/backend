-- AlterTable
ALTER TABLE "alternatives" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "files" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "questions" ALTER COLUMN "updatedAt" DROP NOT NULL;
