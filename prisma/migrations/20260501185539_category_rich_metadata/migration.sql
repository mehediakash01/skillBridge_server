-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "description" TEXT,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "isTrending" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "learnerCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "startingPrice" DECIMAL(65,30),
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
