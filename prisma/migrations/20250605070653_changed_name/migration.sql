/*
  Warnings:

  - You are about to drop the column `alternativesIntroduction` on the `questions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "questions" DROP COLUMN "alternativesIntroduction",
ADD COLUMN     "introduction" TEXT;
