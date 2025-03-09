/*
  Warnings:

  - You are about to drop the column `scheme` on the `Saving` table. All the data in the column will be lost.
  - You are about to drop the column `years` on the `Saving` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Saving" DROP COLUMN "scheme",
DROP COLUMN "years",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
