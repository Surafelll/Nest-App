-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "deletedAt" TIMESTAMP(3);
