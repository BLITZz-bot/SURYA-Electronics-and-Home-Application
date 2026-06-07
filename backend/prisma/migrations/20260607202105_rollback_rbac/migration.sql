/*
  Warnings:

  - You are about to drop the column `isSuspended` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `RoleLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RoleLog" DROP CONSTRAINT "RoleLog_changedBy_fkey";

-- DropForeignKey
ALTER TABLE "RoleLog" DROP CONSTRAINT "RoleLog_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isSuspended",
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'customer';

-- DropTable
DROP TABLE "RoleLog";

-- DropEnum
DROP TYPE "UserRole";
