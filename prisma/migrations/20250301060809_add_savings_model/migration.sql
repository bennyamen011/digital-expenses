-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "date" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Saving" (
    "id" TEXT NOT NULL,
    "scheme" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "years" INTEGER NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Saving_pkey" PRIMARY KEY ("id")
);
