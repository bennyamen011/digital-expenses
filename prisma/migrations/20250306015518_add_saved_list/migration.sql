-- CreateTable
CREATE TABLE "Saved" (
    "id" TEXT NOT NULL,
    "savingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "Saved_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Saved" ADD CONSTRAINT "Saved_savingId_fkey" FOREIGN KEY ("savingId") REFERENCES "Saving"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
