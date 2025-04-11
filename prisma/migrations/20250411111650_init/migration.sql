/*
  Warnings:

  - The primary key for the `System` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `System` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Alert` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_systemId_fkey";

-- AlterTable
ALTER TABLE "System" DROP CONSTRAINT "System_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "System_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Alert";

-- DropEnum
DROP TYPE "UserRole";
