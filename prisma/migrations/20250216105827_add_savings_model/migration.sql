-- CreateTable
CREATE TABLE "Saving" (
    "id" TEXT NOT NULL,
    "scheme" TEXT NOT NULL,
    "monthlyInvestmentAmount" DOUBLE PRECISION NOT NULL,
    "years" INTEGER NOT NULL,
    "maturityAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Saving_pkey" PRIMARY KEY ("id")
);
